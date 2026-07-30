import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  ApiService,
  ChauffeurResponseDTO
} from '../../../core/api.service';

type DriverStatusFilter = 'TOUS' | 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';

@Component({
  selector: 'app-chauffeur-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './chauffeur-list.html',
  styleUrls: ['./chauffeur-list.css']
})
export class ChauffeurList implements OnInit {

  public chauffeurs: ChauffeurResponseDTO[] = [];
  public recherche = '';
  public filtreStatut: DriverStatusFilter = 'TOUS';

  public chargement = false;
  public actionEnCoursId: number | null = null;

  public messageSucces = '';
  public messageErreur = '';

  public chauffeurSelectionne: ChauffeurResponseDTO | null = null;
  public detailOuvert = false;

  constructor(
    public readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.loadChauffeurs();
  }

  public loadChauffeurs(): void {
    this.chargement = true;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.getAllChauffeurs(true)
      .pipe(
        finalize(() => {
          this.chargement = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data: ChauffeurResponseDTO[]) => {
          this.chauffeurs = Array.isArray(data) ? [...data] : [];
          this.cdr.markForCheck();
        },
        error: (erreur: unknown) => {
          console.error('Erreur lors du chargement des chauffeurs :', erreur);
          this.chauffeurs = [];
          this.messageErreur =
            'Impossible de charger les chauffeurs. Vérifiez que le backend est démarré.';
          this.cdr.markForCheck();
        }
      });
  }

  public get chauffeursFiltres(): ChauffeurResponseDTO[] {
    const terme = this.recherche.trim().toLocaleLowerCase('fr');

    return this.chauffeurs.filter((chauffeur: ChauffeurResponseDTO) => {
      const correspondAuStatut =
        this.filtreStatut === 'TOUS'
        || (this.filtreStatut === 'EN_ATTENTE' && chauffeur.statutValidation === 0)
        || (this.filtreStatut === 'APPROUVE' && chauffeur.statutValidation === 1)
        || (this.filtreStatut === 'REJETE' && chauffeur.statutValidation === 2);

      if (!correspondAuStatut) {
        return false;
      }

      if (!terme) {
        return true;
      }

      const contenuRecherche = [
        chauffeur.id,
        chauffeur.nom,
        chauffeur.prenom,
        chauffeur.email,
        chauffeur.telephone
      ]
        .filter((valeur: string | number | undefined) =>
          valeur !== null && valeur !== undefined
        )
        .join(' ')
        .toLocaleLowerCase('fr');

      return contenuRecherche.includes(terme);
    });
  }

  public get chauffeursValides(): number {
    return this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.statutValidation === 1
    ).length;
  }

  public get chauffeursEnAttente(): number {
    return this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.statutValidation === 0
    ).length;
  }

  public get chauffeursRejetes(): number {
    return this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.statutValidation === 2
    ).length;
  }

  public get soldeTotal(): number {
    return this.chauffeurs.reduce(
      (total: number, chauffeur: ChauffeurResponseDTO) =>
        total + Number(chauffeur.soldeCredit ?? 0),
      0
    );
  }

  public get noteMoyenneFlotte(): number {
    const chauffeursAvecNote = this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) =>
        Number(chauffeur.noteMoyenne ?? 0) > 0
    );

    if (chauffeursAvecNote.length === 0) {
      return 0;
    }

    const totalNotes = chauffeursAvecNote.reduce(
      (total: number, chauffeur: ChauffeurResponseDTO) =>
        total + Number(chauffeur.noteMoyenne ?? 0),
      0
    );

    return totalNotes / chauffeursAvecNote.length;
  }

  public approuver(id: number): void {
    const chauffeur = this.trouverChauffeur(id);

    if (!chauffeur || chauffeur.statutValidation === 1) {
      return;
    }

    this.actionEnCoursId = id;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.validerChauffeur(id, 1).subscribe({
      next: () => {
        this.mettreAJourStatutLocal(id, 1);
        this.actionEnCoursId = null;
        this.messageSucces =
          `Le chauffeur ${this.nomComplet(chauffeur)} a été approuvé.`;
      },
      error: (erreur: unknown) => {
        console.error(`Erreur lors de l'approbation du chauffeur ${id} :`, erreur);
        this.actionEnCoursId = null;
        this.messageErreur = 'La validation du chauffeur a échoué.';
      }
    });
  }

  public rejeter(id: number): void {
    const chauffeur = this.trouverChauffeur(id);

    if (!chauffeur || chauffeur.statutValidation === 2) {
      return;
    }

    const confirmation = window.confirm(
      `Confirmer le rejet du chauffeur ${this.nomComplet(chauffeur)} ?`
    );

    if (!confirmation) {
      return;
    }

    this.actionEnCoursId = id;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.rejeter(id).subscribe({
      next: () => {
        this.mettreAJourStatutLocal(id, 2);
        this.actionEnCoursId = null;
        this.messageSucces =
          `Le chauffeur ${this.nomComplet(chauffeur)} a été rejeté.`;
      },
      error: (erreur: unknown) => {
        console.error(`Erreur lors du rejet du chauffeur ${id} :`, erreur);
        this.actionEnCoursId = null;
        this.messageErreur = 'Le rejet du chauffeur a échoué.';
      }
    });
  }

  public remettreEnAttente(id: number): void {
    const chauffeur = this.trouverChauffeur(id);

    if (!chauffeur || chauffeur.statutValidation === 0) {
      return;
    }

    const confirmation = window.confirm(
      `Replacer ${this.nomComplet(chauffeur)} dans les profils en attente ?`
    );

    if (!confirmation) {
      return;
    }

    this.actionEnCoursId = id;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.validerChauffeur(id, 0).subscribe({
      next: () => {
        this.mettreAJourStatutLocal(id, 0);
        this.actionEnCoursId = null;
        this.messageSucces =
          `Le chauffeur ${this.nomComplet(chauffeur)} est maintenant en attente.`;
      },
      error: (erreur: unknown) => {
        console.error(`Erreur lors du changement de statut du chauffeur ${id} :`, erreur);
        this.actionEnCoursId = null;
        this.messageErreur = 'Le changement de statut du chauffeur a échoué.';
      }
    });
  }

  public ouvrirDetail(chauffeur: ChauffeurResponseDTO): void {
    this.chauffeurSelectionne = { ...chauffeur };
    this.detailOuvert = true;
  }

  public fermerDetail(): void {
    this.detailOuvert = false;
    this.chauffeurSelectionne = null;
  }

  public effacerRecherche(): void {
    this.recherche = '';
    this.filtreStatut = 'TOUS';
  }

  public estActionEnCours(id: number): boolean {
    return this.actionEnCoursId === id;
  }

  public nomComplet(chauffeur: ChauffeurResponseDTO): string {
    const nomComplet = [
      chauffeur.prenom?.trim(),
      chauffeur.nom?.trim()
    ].filter(Boolean).join(' ');

    return nomComplet || `Chauffeur #${chauffeur.id}`;
  }

  public initiales(chauffeur: ChauffeurResponseDTO): string {
    const prenom = chauffeur.prenom?.trim().charAt(0) ?? '';
    const nom = chauffeur.nom?.trim().charAt(0) ?? '';
    const resultat = `${prenom}${nom}`.toUpperCase();

    return resultat || 'CH';
  }

  public libelleStatut(statut: number): string {
    switch (statut) {
      case 1:
        return 'Approuvé';
      case 2:
        return 'Rejeté';
      default:
        return 'En attente';
    }
  }

  public classeStatut(statut: number): string {
    switch (statut) {
      case 1:
        return 'tag-emerald';
      case 2:
        return 'tag-red';
      default:
        return 'tag-amber';
    }
  }

  public formaterNote(note?: number): string {
    return Number(note ?? 0).toFixed(1);
  }

  public formaterSolde(solde?: number): string {
    return new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(solde ?? 0));
  }

  public suivreChauffeur(index: number, chauffeur: ChauffeurResponseDTO): number {
    return chauffeur.id;
  }

  private trouverChauffeur(id: number): ChauffeurResponseDTO | undefined {
    return this.chauffeurs.find(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.id === id
    );
  }

  private mettreAJourStatutLocal(id: number, nouveauStatut: number): void {
    this.chauffeurs = this.chauffeurs.map(
      (chauffeur: ChauffeurResponseDTO) =>
        chauffeur.id === id
          ? { ...chauffeur, statutValidation: nouveauStatut }
          : chauffeur
    );

    if (this.chauffeurSelectionne?.id === id) {
      this.chauffeurSelectionne = {
        ...this.chauffeurSelectionne,
        statutValidation: nouveauStatut
      };
    }
  }
}
