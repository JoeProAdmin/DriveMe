import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css']
})
export class CourseList implements OnInit, OnDestroy {

  courses: any[] = [];
  loading = false;
  errorMessage = '';

  private refreshSubscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();

    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadCourses(false);
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadCourses(showLoading: boolean = true): void {
    if (showLoading) {
      this.loading = true;
    }

    this.errorMessage = '';

    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');

    if (role === 'ADMIN') {
      this.apiService.getCourses().subscribe({
        next: data => {
          this.courses = data;
          this.loading = false;
        },
        error: error => {
          console.error(error);
          this.errorMessage = 'Erreur chargement courses admin';
          this.loading = false;
        }
      });
      return;
    }

    if (role === 'PASSAGER' && email) {
      this.apiService.getAllPassagers().subscribe({
        next: passagers => {
          const passager = passagers.find((p: any) => p.email === email);

          if (!passager) {
            this.courses = [];
            this.loading = false;
            return;
          }

          this.apiService.getCoursesByPassager(passager.id).subscribe({
            next: data => {
              this.courses = data;
              this.loading = false;
            },
            error: error => {
              console.error(error);
              this.errorMessage = 'Erreur chargement courses passager';
              this.loading = false;
            }
          });
        },
        error: error => {
          console.error(error);
          this.errorMessage = 'Erreur récupération profil passager';
          this.loading = false;
        }
      });
      return;
    }

    if (role === 'CHAUFFEUR' && email) {
      this.apiService.getAllChauffeurs().subscribe({
        next: chauffeurs => {
          const chauffeur = chauffeurs.find((c: any) => c.email === email);

          if (!chauffeur) {
            this.courses = [];
            this.loading = false;
            return;
          }

          this.apiService.getCoursesByChauffeur(chauffeur.id).subscribe({
            next: data => {
              this.courses = data;
              this.loading = false;
            },
            error: error => {
              console.error(error);
              this.errorMessage = 'Erreur chargement courses chauffeur';
              this.loading = false;
            }
          });
        },
        error: error => {
          console.error(error);
          this.errorMessage = 'Erreur récupération profil chauffeur';
          this.loading = false;
        }
      });
      return;
    }

    this.courses = [];
    this.loading = false;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
