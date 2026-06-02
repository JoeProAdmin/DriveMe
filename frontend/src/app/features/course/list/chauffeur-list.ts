import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, ChauffeurResponseDTO } from '../../../core/api.service';

@Component({
  selector: 'app-chauffeur-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chauffeur-list.html',
  styleUrls: ['./chauffeur-list.css']
})
export class ChauffeurList implements OnInit {

  // Données de la flotte de conducteurs
  public chauffeurs: ChauffeurResponseDTO[] = [];

  // Métriques de synthèse pour les mini-cartes KPI
  public totalChauffeurs: number = 0;
  public chauffeursValides: number = 0;
  public chauffeursEnAttente: number = 0;

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.loadChauffeurs();
  }

  /**
   * Consomme l'endpoint de ton ChauffeurController.java existant
   */
  public loadChauffeurs(): void {
    this.apiService.getAllChauffeurs().subscribe({
      next: (data: ChauffeurResponseDTO[]) => {
        this.chauffeurs = data;
        this.calculateMetrics();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement de la flotte :', err);
      }
    });
  }

  /**
   * Calcule dynamiquement les compteurs à partir du statutValidation (Byte ou String)
   */
  private calculateMetrics(): void {
    this.totalChauffeurs = this.chauffeurs.length;

    // Protection adaptative selon que ton service renvoie le Byte (0,1) ou le texte converti
    this.chauffeursValides = this.chauffeurs.filter(c =>
      c.statutValidation === 'APPROUVE' || c.statutValidation === '1'
    ).length;

    this.chauffeursEnAttente = this.chauffeurs.filter(c =>
      c.statutValidation === 'EN_ATTENTE' || c.statutValidation === '0'
    ).length;
  }

  /**
   * Action d'approbation rapide en direct (statut byte 1 = APPROUVE)
   */
  public approuver(id: number): void {
    this.apiService.validerChauffeur(id, 1).subscribe({
      next: () => {
        this.loadChauffeurs(); // Recharge la grille immédiatement
      },
      error: (err: any) => console.error('Erreur approbation :', err)
    });
  }

  /**
   * Action de rejet rapide en direct (statut byte 2 = REJETE)
   */
  public rejeter(id: number): void {
    this.apiService.validerChauffeur(id, 2).subscribe({
      next: () => {
        this.loadChauffeurs();
      },
      error: (err: any) => console.error('Erreur rejet :', err)
    });
  }
}
