import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-passenger-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './passenger-view.html',
  styleUrls: ['./passenger-view.css']
})
export class PassengerViewComponent implements OnInit {

  public passengerName = 'Passager DriveMe';

  public stats = {
    totalCourses: 0,
    coursesEnAttente: 0,
    coursesTerminees: 0,
    avisDonnes: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.apiService.getCourses().subscribe({
      next: (courses: any[]) => {

        console.log('COURSES RECUES :', courses);

        this.stats.totalCourses = courses.length;

        this.stats.coursesEnAttente =
          courses.filter(c => c.statut === 'EN_ATTENTE').length;

        this.stats.coursesTerminees =
          courses.filter(c => c.statut === 'TERMINEE').length;

        this.stats.avisDonnes = 0;
      },
      error: (err: any) => {
        console.error('Erreur chargement statistiques passager', err);
      }
    });
  }
}
