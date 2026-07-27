import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ApiService,
  ChauffeurResponseDTO,
  PropositionCreateDTO
} from '../../../core/api.service';

interface PropositionFormState {
  prixPropose: number | null;
  tempsEstimeMinutes: number | null;
  message: string;
}

@Component({
  selector: 'app-driver-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-view.html',
  styleUrls: ['./driver-view.css']
})
export class DriverViewComponent implements OnInit {

  public chauffeur?: ChauffeurResponseDTO;
  public coursesDisponibles: any[] = [];

  public coursePropositionOuverteId: number | null = null;

  public propositionForms: Record<number, PropositionFormState> = {};
  public propositionEnCours: Record<number, boolean> = {};
  public propositionMessages: Record<number, string> = {};
  public propositionErreurs: Record<number, string> = {};

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
      reputation: 'Réputation Chauffeur',
      departure: 'Départ',
      arrival: 'Arrivée',
      status: 'Statut',
      propose: 'Faire une proposition',
      proposedPrice: 'Prix proposé',
      estimatedTime: 'Temps estimé',
      minutes: 'minutes',
      message: 'Message au passager',
      optional: 'Optionnel',
      sendProposal: 'Envoyer la proposition',
      sending: 'Envoi en cours...',
      cancel: 'Annuler',
      proposalSent: 'Votre proposition a été envoyée.',
      priceRequired: 'Veuillez saisir un prix valide.',
      driverUnavailable: 'Profil chauffeur indisponible.',
      proposalError: 'Impossible d’envoyer la proposition.',
      searching: 'Recherche de courses en cours',
      searchingSubtitle: 'Restez connecté, les nouvelles demandes s’afficheront ici automatiquement.'
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
      reputation: 'Driver Reputation',
      departure: 'Departure',
      arrival: 'Arrival',
      status: 'Status',
      propose: 'Make an offer',
      proposedPrice: 'Proposed price',
      estimatedTime: 'Estimated time',
      minutes: 'minutes',
      message: 'Message to passenger',
      optional: 'Optional',
      sendProposal: 'Send offer',
      sending: 'Sending...',
      cancel: 'Cancel',
      proposalSent: 'Your offer has been sent.',
      priceRequired: 'Please enter a valid price.',
      driverUnavailable: 'Driver profile unavailable.',
      proposalError: 'Unable to send the offer.',
      searching: 'Searching for trips',
      searchingSubtitle: 'Stay connected. New requests will appear here automatically.'
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
      reputation: 'سمعة السائق',
      departure: 'الانطلاق',
      arrival: 'الوصول',
      status: 'الحالة',
      propose: 'تقديم عرض',
      proposedPrice: 'السعر المقترح',
      estimatedTime: 'الوقت المتوقع',
      minutes: 'دقيقة',
      message: 'رسالة إلى الراكب',
      optional: 'اختياري',
      sendProposal: 'إرسال العرض',
      sending: 'جارٍ الإرسال...',
      cancel: 'إلغاء',
      proposalSent: 'تم إرسال عرضك.',
      priceRequired: 'يرجى إدخال سعر صحيح.',
      driverUnavailable: 'ملف السائق غير متاح.',
      proposalError: 'تعذر إرسال العرض.',
      searching: 'جارٍ البحث عن رحلات',
      searchingSubtitle: 'ابق متصلاً، ستظهر الطلبات الجديدة هنا تلقائياً.'
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
      reputation: 'Reputación del Conductor',
      departure: 'Salida',
      arrival: 'Llegada',
      status: 'Estado',
      propose: 'Hacer una oferta',
      proposedPrice: 'Precio propuesto',
      estimatedTime: 'Tiempo estimado',
      minutes: 'minutos',
      message: 'Mensaje al pasajero',
      optional: 'Opcional',
      sendProposal: 'Enviar oferta',
      sending: 'Enviando...',
      cancel: 'Cancelar',
      proposalSent: 'Tu oferta ha sido enviada.',
      priceRequired: 'Introduce un precio válido.',
      driverUnavailable: 'Perfil del conductor no disponible.',
      proposalError: 'No se pudo enviar la oferta.',
      searching: 'Buscando viajes',
      searchingSubtitle: 'Mantente conectado. Las nuevas solicitudes aparecerán aquí automáticamente.'
    }
  };

  constructor(public apiService: ApiService) {}

  get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.apiService.currentLanguage();
  }

  public ngOnInit(): void {
    this.loadDriverData();
    this.loadCoursesDisponibles();
  }

  public ouvrirProposition(course: any): void {
    const courseId = Number(course?.id);

    if (!courseId) {
      return;
    }

    this.propositionMessages[courseId] = '';
    this.propositionErreurs[courseId] = '';

    if (!this.propositionForms[courseId]) {
      this.propositionForms[courseId] = {
        prixPropose: Number(course?.prix) || null,
        tempsEstimeMinutes: null,
        message: ''
      };
    }

    this.coursePropositionOuverteId = courseId;
  }

  public annulerProposition(courseId: number): void {
    this.coursePropositionOuverteId = null;
    this.propositionErreurs[courseId] = '';
  }

  public envoyerProposition(course: any): void {
    const courseId = Number(course?.id);
    const chauffeurId = Number(this.chauffeur?.id);
    const form = this.propositionForms[courseId];

    this.propositionMessages[courseId] = '';
    this.propositionErreurs[courseId] = '';

    if (!chauffeurId) {
      this.propositionErreurs[courseId] =
        this.labels[this.currentLang].driverUnavailable;
      return;
    }

    const prixPropose = Number(form?.prixPropose);

    if (!prixPropose || prixPropose <= 0) {
      this.propositionErreurs[courseId] =
        this.labels[this.currentLang].priceRequired;
      return;
    }

    const tempsEstime = Number(form?.tempsEstimeMinutes);

    const proposition: PropositionCreateDTO = {
      courseId,
      chauffeurId,
      prixPropose,
      message: form?.message?.trim() || undefined,
      tempsEstimeMinutes:
        tempsEstime > 0 ? tempsEstime : undefined
    };

    this.propositionEnCours[courseId] = true;

    this.apiService.creerProposition(proposition).subscribe({
      next: () => {
        this.propositionEnCours[courseId] = false;
        this.propositionMessages[courseId] =
          this.labels[this.currentLang].proposalSent;

        this.coursePropositionOuverteId = null;

        /*
         * La course reste EN_ATTENTE côté backend jusqu'au choix du passager.
         * Elle est retirée localement pour éviter que le même chauffeur
         * envoie plusieurs propositions depuis cet écran.
         */
        this.coursesDisponibles = this.coursesDisponibles.filter(
          disponible => Number(disponible?.id) !== courseId
        );

        delete this.propositionForms[courseId];
      },

      error: (err: any) => {
        console.error('Erreur envoi proposition', err);

        this.propositionEnCours[courseId] = false;

        this.propositionErreurs[courseId] =
          err?.error?.message ||
          this.labels[this.currentLang].proposalError;
      }
    });
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

      error: (err: any) => {
        console.error('Erreur chargement chauffeur', err);
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
          this.applyCourseStats([]);
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

  private loadCoursesDisponibles(): void {
    this.apiService.getCoursesEnAttente().subscribe({
      next: (courses: any[]) => {
        this.coursesDisponibles = Array.isArray(courses)
          ? courses
          : [];

        console.log(
          'COURSES DISPONIBLES =',
          this.coursesDisponibles
        );
      },

      error: (err: any) => {
        console.error(
          'Erreur chargement courses disponibles',
          err
        );

        this.coursesDisponibles = [];
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
      revenus
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
