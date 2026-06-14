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
  userRole = '';

  private refreshSubscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
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
      this.loadAdminCourses();
      return;
    }

    if (role === 'PASSAGER' && email) {
      this.loadPassengerCourses(email);
      return;
    }

    if (role === 'CHAUFFEUR' && email) {
      this.loadDriverCourses();
      return;
    }

    this.courses = [];
    this.loading = false;
  }

  private loadAdminCourses(): void {
    this.apiService.getCourses().subscribe({
      next: (data: any[]) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Erreur chargement courses admin';
        this.loading = false;
      }
    });
  }

  private loadPassengerCourses(email: string): void {
    this.apiService.getAllPassagers().subscribe({
      next: (passagers: any[]) => {
        const passager = passagers.find(
          (p: any) => p.email === email
        );

        if (!passager) {
          this.courses = [];
          this.loading = false;
          return;
        }

        this.apiService.getCoursesByPassager(passager.id).subscribe({
          next: (data: any[]) => {
            this.courses = data;
            this.loading = false;
          },
          error: (error: any) => {
            console.error(error);
            this.errorMessage = 'Erreur chargement courses passager';
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Erreur récupération profil passager';
        this.loading = false;
      }
    });
  }

  private loadDriverCourses(): void {
    this.apiService.getCourses().subscribe({
      next: (data: any[]) => {
        this.courses = data.filter(
          (course: any) =>
            course.statut === 'EN_ATTENTE' ||
            course.statut === 'ACCEPTEE'
        );
        this.loading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Erreur chargement courses chauffeur';
        this.loading = false;
      }
    });
  }

  acceptCourse(courseId: number): void {
    this.apiService.updateCourseStatus(courseId, 'ACCEPTEE').subscribe({
      next: () => {
        this.loadCourses(true);
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Erreur acceptation course';
      }
    });
  }

  finishCourse(courseId: number): void {
    this.apiService.updateCourseStatus(courseId, 'TERMINEE').subscribe({
      next: () => {
        this.loadCourses(true);
      },
      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Erreur terminaison course';
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
