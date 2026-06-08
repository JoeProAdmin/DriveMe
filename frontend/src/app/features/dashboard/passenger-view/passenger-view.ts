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

  constructor(public apiService: ApiService) {}

  get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.apiService.currentLanguage();
  }

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.apiService.getCourses().subscribe({
      next: (courses: any[]) => {

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
