import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, ChauffeurResponseDTO } from '../../../core/api.service';

@Component({
  selector: 'app-driver-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-view.html',
  styleUrls: ['./driver-view.css']
})
export class DriverViewComponent implements OnInit {

  public chauffeur?: ChauffeurResponseDTO;

  public stats = {
    coursesTotal: 0,
    coursesEnCours: 0,
    revenus: 0,
    note: 0,
    soldeCredit: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDriverData();
  }

  private loadDriverData(): void {
    this.apiService.getAllChauffeurs().subscribe({
      next: (chauffeurs: ChauffeurResponseDTO[]) => {
        if (chauffeurs.length > 0) {
          this.chauffeur = chauffeurs[0];

          this.stats.note = this.chauffeur.noteMoyenne ?? 0;
          this.stats.soldeCredit = this.chauffeur.soldeCredit ?? 0;
        }
      },
      error: (err: any) => {
        console.error('Erreur chargement données chauffeur', err);
      }
    });
  }
}
