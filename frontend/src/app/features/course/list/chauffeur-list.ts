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

  public chauffeurs: ChauffeurResponseDTO[] = [];

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.loadChauffeurs();
  }

  public loadChauffeurs(): void {

    console.log('=== CHARGEMENT CHAUFFEURS ===');

    this.apiService.getAllChauffeurs().subscribe({
      next: (data: ChauffeurResponseDTO[]) => {

        console.log('CHAUFFEURS RECUS :', data);

        this.chauffeurs = [...data];

        console.log('TABLEAU FINAL :', this.chauffeurs);

      },
      error: (err: any) => {
        console.error('Erreur API Chauffeurs :', err);
      }
    });
  }

  get chauffeursValides(): number {
    return this.chauffeurs.filter(c => c.statutValidation === 1).length;
  }

  get chauffeursEnAttente(): number {
    return this.chauffeurs.filter(c => c.statutValidation === 0).length;
  }

  public approuver(id: number): void {
    this.apiService.validerChauffeur(id, 1).subscribe({
      next: () => this.loadChauffeurs(),
      error: (err: any) => console.error(err)
    });
  }

  public rejeter(id: number): void {
    this.apiService.rejeter(id).subscribe({
      next: () => this.loadChauffeurs(),
      error: (err: any) => console.error(err)
    });
  }
}
