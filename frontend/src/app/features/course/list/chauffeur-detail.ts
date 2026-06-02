import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, ChauffeurResponseDTO } from '../../../core/api.service';

@Component({
  selector: 'app-chauffeur-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chauffeur-detail.html',
  styleUrls: ['./chauffeur-detail.css']
})
export class ChauffeurDetail implements OnInit {

  public chauffeur: ChauffeurResponseDTO | null = null;
  public isLoading: boolean = true;
  public errorMessage: string = '';

  // Simulation des documents requis pour le TFE (Permis, Assurance, Carte Grise)
  public documents = [
    { type: 'Permis de Conduire', statut: 'Valide', dateDepot: '2026-05-10' },
    { type: 'Assurance Véhicule', statut: 'En attente de vérification', dateDepot: '2026-06-01' },
    { type: 'Carte Grise', statut: 'Valide', dateDepot: '2026-05-12' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadChauffeurData(+idParam);
    } else {
      this.errorMessage = 'Identifiant chauffeur manquant.';
      this.isLoading = false;
    }
  }

  private loadChauffeurData(id: number): void {
    this.isLoading = true;
    // On réutilise la méthode du controleur pour récupérer le profil spécifique
    this.apiService.getAllChauffeurs().subscribe({
      next: (list: ChauffeurResponseDTO[]) => {
        const found = list.find(c => c.id === id);
        if (found) {
          this.chauffeur = found;
        } else {
          this.errorMessage = 'Chauffeur introuvable.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les données du serveur.';
        this.isLoading = false;
      }
    });
  }

  public modifierValidation(statutByte: number): void {
    if (!this.chauffeur) return;
    this.apiService.validerChauffeur(this.chauffeur.id, statutByte).subscribe({
      next: () => {
        if (this.chauffeur) {
          // Mise à jour locale immédiate de l'interface pour éviter un rechargement lourd
          this.chauffeur.statutValidation = statutByte.toString();
        }
      },
      error: (err) => console.error('Erreur lors du changement de statut', err)
    });
  }

  public retourner(): void {
    this.router.navigate(['/courses/chauffeurs']); // Ajuste la route selon ton routing
  }
}
