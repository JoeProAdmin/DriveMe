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
    coursesTerminees: 0,
    revenus: 0,
    note: 0,
    soldeCredit: 0
  };

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadDriverData();
  }

  private loadDriverData(): void {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      console.error('Aucun email utilisateur trouvé dans le localStorage');
      return;
    }

    this.apiService.getChauffeurByEmail(email).subscribe({
      next: (chauffeur: ChauffeurResponseDTO) => {
        this.chauffeur = chauffeur;

        this.stats = {
          ...this.stats,
          note: chauffeur.noteMoyenne ?? 0,
          soldeCredit: chauffeur.soldeCredit ?? 0
        };

        this.loadCoursesForCurrentDriver();
      },
      error: (err: any) => {
        console.error('Erreur chargement chauffeur connecté', err);
      }
    });
  }

  private loadCoursesForCurrentDriver(): void {
    if (!this.chauffeur) {
      return;
    }

    this.apiService.getCoursesByChauffeur(this.chauffeur.id).subscribe({
      next: (courses: any[]) => {
        const coursesAcceptees = courses.filter(
          (course: any) => course.statut === 'ACCEPTEE'
        );

        const coursesTerminees = courses.filter(
          (course: any) => course.statut === 'TERMINEE'
        );

        const revenus = coursesTerminees.reduce(
          (total: number, course: any) => total + (course.prix || 0),
          0
        );

        this.stats = {
          ...this.stats,
          coursesTotal: courses.length,
          coursesEnCours: coursesAcceptees.length,
          coursesTerminees: coursesTerminees.length,
          revenus: revenus
        };
      },
      error: (err: any) => {
        console.error('Erreur chargement courses du chauffeur connecté', err);
      }
    });
  }
}
