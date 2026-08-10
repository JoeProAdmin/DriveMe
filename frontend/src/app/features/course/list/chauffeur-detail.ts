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

  public documents: Array<{ type: string; statut: string; dateDepot: string }> = [];

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
    this.apiService.getAllChauffeurs().subscribe({
      next: (list: ChauffeurResponseDTO[]) => {
        const found = list.find(c => c.id === id);
        this.chauffeur = found || null;
        if (!found) this.errorMessage = 'Chauffeur introuvable.';
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les données.';
        this.isLoading = false;
      }
    });
  }

  public modifierValidation(statutByte: number): void {
    if (!this.chauffeur) return;
    this.apiService.validerChauffeur(this.chauffeur.id, statutByte).subscribe({
      next: () => {
        if (this.chauffeur) {
          // CORRECTION CRITIQUE : on affecte le nombre, pas une chaîne
          this.chauffeur.statutValidation = Number(statutByte);
        }
      },
      error: (err: any) => console.error('Erreur lors du changement de statut', err)
    });
  }

  public retourner(): void {
    this.router.navigate(['/courses/chauffeurs']);
  }
}
