import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css']
})
export class CourseList implements OnInit {

  courses: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {

    this.loading = true;
    this.errorMessage = '';

    const role = localStorage.getItem('userRole');

    /*
     * ADMIN
     */
    if (role === 'ADMIN') {

      this.apiService.getCourses().subscribe({
        next: (data: any[]) => {
          this.courses = data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage = 'Erreur chargement courses';
          this.loading = false;
        }
      });

      return;
    }

    /*
     * PASSAGER
     */
    if (role === 'PASSAGER') {

      this.apiService.getCoursesByPassager(1).subscribe({
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

      return;
    }

    /*
     * CHAUFFEUR
     */
    if (role === 'CHAUFFEUR') {

      this.apiService.getCoursesByChauffeur(1).subscribe({
        next: (data: any[]) => {
          this.courses = data;
          this.loading = false;
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage = 'Erreur chargement courses chauffeur';
          this.loading = false;
        }
      });

      return;
    }

    this.loading = false;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
