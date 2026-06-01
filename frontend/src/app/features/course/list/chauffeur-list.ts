import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-chauffeur-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chauffeur-list.html',
  styleUrls: ['./chauffeur-list.css']
})
export class ChauffeurList implements OnInit {

  chauffeurs: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChauffeurs();
  }

  loadChauffeurs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getChauffeurs().subscribe({
      next: (data) => {
        this.chauffeurs = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Erreur lors du chargement des chauffeurs.';
        this.loading = false;
      }
    });
  }

  deleteChauffeur(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce chauffeur ?')) {
      return;
    }

    this.apiService.deleteChauffeur(id).subscribe({
      next: () => {
        this.loadChauffeurs();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Erreur lors de la suppression du chauffeur.';
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
