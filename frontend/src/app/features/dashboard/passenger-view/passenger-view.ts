import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, PassagerResponseDTO } from '../../../core/api.service';

@Component({
  selector: 'app-passenger-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './passenger-view.html',
  styleUrls: ['./passenger-view.css']
})
export class PassengerViewComponent implements OnInit {

  public passenger?: PassagerResponseDTO;
  public passengerName = 'Passager DriveMe';

  public stats = {
    totalCourses: 0,
    coursesEnAttente: 0,
    coursesTerminees: 0,
    avisDonnes: 0
  };

  public texts: any = {

    fr: {
      title: 'Espace passager',
      subtitle: 'Commandez une course, suivez vos trajets et consultez votre activité DriveMe.',
      orderRide: 'Commander une course',
      totalCourses: 'Total courses',
      pending: 'En attente',
      completed: 'Terminées',
      reviews: 'Avis donnés',
      newRide: 'Nouvelle course',
      newRideDesc: 'Indiquez un départ, une destination et proposez votre prix.',
      createRequest: 'Créer une demande',
      myTrips: 'Mes courses',
      myTripsDesc: 'Consultez les courses en attente, acceptées ou terminées.',
      history: 'Voir l’historique',
      payments: 'Paiements',
      paymentsDesc: 'Suivez les paiements et la logique de facturation DriveMe.',
      accessPayments: 'Accéder aux paiements'
    },

    en: {
      title: 'Passenger Area',
      subtitle: 'Book rides, track your trips and manage your DriveMe activity.',
      orderRide: 'Book a Ride',
      totalCourses: 'Total Trips',
      pending: 'Pending',
      completed: 'Completed',
      reviews: 'Reviews',
      newRide: 'New Ride',
      newRideDesc: 'Enter a departure point, destination and propose your price.',
      createRequest: 'Create Request',
      myTrips: 'My Trips',
      myTripsDesc: 'View pending, accepted and completed trips.',
      history: 'View History',
      payments: 'Payments',
      paymentsDesc: 'Track payments and billing activity.',
      accessPayments: 'Access Payments'
    },

    ar: {
      title: 'مساحة الراكب',
      subtitle: 'اطلب رحلة وتتبع تنقلاتك واطلع على نشاطك في DriveMe.',
      orderRide: 'طلب رحلة',
      totalCourses: 'إجمالي الرحلات',
      pending: 'قيد الانتظار',
      completed: 'مكتملة',
      reviews: 'التقييمات',
      newRide: 'رحلة جديدة',
      newRideDesc: 'حدد نقطة الانطلاق والوجهة واقترح السعر.',
      createRequest: 'إنشاء طلب',
      myTrips: 'رحلاتي',
      myTripsDesc: 'استعرض الرحلات المعلقة والمقبولة والمنتهية.',
      history: 'عرض السجل',
      payments: 'المدفوعات',
      paymentsDesc: 'تتبع المدفوعات والفواتير.',
      accessPayments: 'الوصول للمدفوعات'
    },

    es: {
      title: 'Espacio Pasajero',
      subtitle: 'Solicita viajes, sigue tus trayectos y consulta tu actividad DriveMe.',
      orderRide: 'Solicitar Viaje',
      totalCourses: 'Total Viajes',
      pending: 'Pendientes',
      completed: 'Finalizados',
      reviews: 'Opiniones',
      newRide: 'Nuevo Viaje',
      newRideDesc: 'Indique origen, destino y proponga su precio.',
      createRequest: 'Crear Solicitud',
      myTrips: 'Mis Viajes',
      myTripsDesc: 'Consulte viajes pendientes, aceptados o finalizados.',
      history: 'Ver Historial',
      payments: 'Pagos',
      paymentsDesc: 'Consulte pagos y facturación.',
      accessPayments: 'Acceder a Pagos'
    }
  };

  constructor(
    public apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.apiService.currentLanguage();
  }

  ngOnInit(): void {
    this.loadPassengerData();
  }

  private loadPassengerData(): void {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      console.error('Email passager absent du localStorage.');
      this.resetStats();
      this.cdr.detectChanges();
      return;
    }

    this.apiService.getPassagerByEmail(email).subscribe({
      next: (passager: PassagerResponseDTO) => {
        this.passenger = passager;
        this.passengerName = `${passager.prenom ?? ''} ${passager.nom ?? ''}`.trim() || 'Passager DriveMe';

        this.loadCoursesForCurrentPassenger(passager.id);
      },
      error: (err: any) => {
        console.error('Erreur chargement passager connecté', err);
        this.resetStats();
        this.cdr.detectChanges();
      }
    });
  }

  private loadCoursesForCurrentPassenger(passagerId: number): void {
    this.apiService.getCoursesByPassager(passagerId).subscribe({
      next: (courses: any[]) => {
        this.applyCourseStats(courses);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement courses passager', err);
        this.resetStats();
        this.cdr.detectChanges();
      }
    });
  }

  private applyCourseStats(courses: any[]): void {
    const safeCourses = Array.isArray(courses) ? courses : [];

    this.stats.totalCourses = safeCourses.length;

    this.stats.coursesEnAttente = safeCourses.filter(course =>
      this.normalizeStatus(course?.statut) === 'EN_ATTENTE'
    ).length;

    this.stats.coursesTerminees = safeCourses.filter(course =>
      this.normalizeStatus(course?.statut) === 'TERMINEE'
    ).length;

    this.stats.avisDonnes = safeCourses.filter(course =>
      course?.avisId ||
      course?.avis ||
      course?.note ||
      course?.commentaireAvis
    ).length;
  }

  private resetStats(): void {
    this.stats.totalCourses = 0;
    this.stats.coursesEnAttente = 0;
    this.stats.coursesTerminees = 0;
    this.stats.avisDonnes = 0;
  }

  private normalizeStatus(status: any): string {
    return String(status ?? '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
