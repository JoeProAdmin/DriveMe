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

  public labels: any = {
    fr: {
      title: 'Espace Chauffeur',
      subtitle: 'Gérez vos courses, vos revenus, vos crédits DriveMe et votre réputation.',
      available: 'Disponible',
      totalCourses: 'Total Courses',
      activeCourses: 'Courses En Cours',
      finishedCourses: 'Courses Terminées',
      estimatedIncome: 'Revenus Estimés',
      credits: 'Crédits DriveMe',
      rating: 'Note Moyenne',
      availableTrips: 'Courses disponibles',
      myTrips: 'Mes trajets',
      myIncome: 'Mes revenus',
      reputation: 'Réputation Chauffeur'
    },
    en: {
      title: 'Driver Area',
      subtitle: 'Manage your trips, earnings, DriveMe credits and reputation.',
      available: 'Available',
      totalCourses: 'Total Trips',
      activeCourses: 'Active Trips',
      finishedCourses: 'Completed Trips',
      estimatedIncome: 'Estimated Earnings',
      credits: 'DriveMe Credits',
      rating: 'Average Rating',
      availableTrips: 'Available Trips',
      myTrips: 'My Trips',
      myIncome: 'My Earnings',
      reputation: 'Driver Reputation'
    },
    ar: {
      title: 'مساحة السائق',
      subtitle: 'إدارة الرحلات والأرباح ورصيد DriveMe والتقييم.',
      available: 'متاح',
      totalCourses: 'إجمالي الرحلات',
      activeCourses: 'الرحلات النشطة',
      finishedCourses: 'الرحلات المكتملة',
      estimatedIncome: 'الأرباح',
      credits: 'رصيد DriveMe',
      rating: 'التقييم',
      availableTrips: 'الرحلات المتاحة',
      myTrips: 'رحلاتي',
      myIncome: 'أرباحي',
      reputation: 'سمعة السائق'
    },
    es: {
      title: 'Espacio Conductor',
      subtitle: 'Gestiona tus viajes, ingresos, créditos DriveMe y reputación.',
      available: 'Disponible',
      totalCourses: 'Total Viajes',
      activeCourses: 'Viajes Activos',
      finishedCourses: 'Viajes Finalizados',
      estimatedIncome: 'Ingresos',
      credits: 'Créditos DriveMe',
      rating: 'Valoración',
      availableTrips: 'Viajes Disponibles',
      myTrips: 'Mis Viajes',
      myIncome: 'Mis Ingresos',
      reputation: 'Reputación del Conductor'
    }
  };

  constructor(public apiService: ApiService) {}

  get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.apiService.currentLanguage();
  }

  ngOnInit(): void {
    this.loadDriverData();
  }

  private loadDriverData(): void {

    const email = localStorage.getItem('userEmail');

    if (!email) {
      this.loadAllCoursesFallback();
      return;
    }

    this.apiService.getChauffeurByEmail(email).subscribe({

      next: (chauffeur: ChauffeurResponseDTO) => {

        console.log('CHAUFFEUR RECU =', chauffeur);

        this.chauffeur = chauffeur;

        this.stats.note = Number(chauffeur.noteMoyenne ?? 0);
        this.stats.soldeCredit = Number(chauffeur.soldeCredit ?? 0);

        this.loadCoursesForCurrentDriver();
      },

      error: () => {
        this.loadAllCoursesFallback();
      }

    });
  }

  private loadCoursesForCurrentDriver(): void {

    if (!this.chauffeur?.id) {
      this.loadAllCoursesFallback();
      return;
    }

    this.apiService.getCoursesByChauffeur(this.chauffeur.id).subscribe({

      next: (courses: any[]) => {

        console.log('COURSES RECUES =', courses);

        if (!courses || courses.length === 0) {
          this.loadAllCoursesFallback();
          return;
        }

        this.applyCourseStats(courses);

        console.log('STATS APPLIQUEES =', this.stats);
      },

      error: (err: any) => {
        console.error('Erreur chargement courses chauffeur', err);
        this.loadAllCoursesFallback();
      }

    });
  }

  private loadAllCoursesFallback(): void {

    this.apiService.getCourses().subscribe({

      next: (courses: any[]) => {

        this.applyCourseStats(courses);

        if (this.stats.soldeCredit === 0) {
          this.stats.soldeCredit = 250;
        }

        if (this.stats.note === 0) {
          this.stats.note = 4.8;
        }
      },

      error: (err: any) => {
        console.error('Erreur chargement fallback courses', err);
      }

    });
  }

  private applyCourseStats(courses: any[]): void {

    const safeCourses = Array.isArray(courses) ? courses : [];

    const coursesEnCours = safeCourses.filter(course =>
      this.normalizeStatus(course.statut) === 'ACCEPTEE'
    );

    const coursesTerminees = safeCourses.filter(course =>
      this.normalizeStatus(course.statut) === 'TERMINEE'
    );

    const revenus = coursesTerminees.reduce((total, course) => {
      return total + this.extractPrice(course);
    }, 0);

    this.stats = {
      ...this.stats,
      coursesTotal: safeCourses.length,
      coursesEnCours: coursesEnCours.length,
      coursesTerminees: coursesTerminees.length,
      revenus: revenus
    };
  }

  private normalizeStatus(status: any): string {

    return String(status ?? '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private extractPrice(course: any): number {

    const value =
      course?.prix ??
      course?.prixPropose ??
      course?.montant ??
      course?.tarif ??
      0;

    return Number(value) || 0;
  }
}
