import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, switchMap } from 'rxjs';
import {
  ApiService,
  ChauffeurResponseDTO,
  CourseResponseDTO,
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
export class DriverViewComponent implements OnInit, OnDestroy {

  public chauffeur?: ChauffeurResponseDTO;
  public coursesDisponibles: CourseResponseDTO[] = [];
  public disponibiliteEnCours = false;
  public disponibiliteErreur = '';

  public coursePropositionOuverteId: number | null = null;

  public propositionForms: Record<number, PropositionFormState> = {};
  public propositionEnCours: Record<number, boolean> = {};
  public propositionMessages: Record<number, string> = {};
  public propositionErreurs: Record<number, string> = {};

  private refreshTimerId: ReturnType<typeof setInterval> | null = null;
  private readonly handleVisibilityChange = (): void => {
    if (!document.hidden) {
      this.refreshDriverWorkspace();
    }
  };

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
      unavailable: 'Indisponible',
      availabilityUpdating: 'Mise à jour...',
      locationUnavailable: 'La géolocalisation est indisponible sur cet appareil.',
      locationDenied: 'Autorisez la géolocalisation pour devenir disponible.',
      availabilityError: 'Impossible de modifier votre disponibilité.',
      mustBeAvailable: 'Activez votre disponibilité avant de faire une proposition.',
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
      unavailable: 'Unavailable',
      availabilityUpdating: 'Updating...',
      locationUnavailable: 'Geolocation is unavailable on this device.',
      locationDenied: 'Allow geolocation to become available.',
      availabilityError: 'Unable to update your availability.',
      mustBeAvailable: 'Go available before making an offer.',
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
      unavailable: 'غير متاح',
      availabilityUpdating: 'جارٍ التحديث...',
      locationUnavailable: 'تحديد الموقع غير متاح على هذا الجهاز.',
      locationDenied: 'اسمح بتحديد الموقع لتصبح متاحاً.',
      availabilityError: 'تعذر تحديث حالة التوفر.',
      mustBeAvailable: 'فعّل حالة التوفر قبل تقديم عرض.',
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
      unavailable: 'No disponible',
      availabilityUpdating: 'Actualizando...',
      locationUnavailable: 'La geolocalización no está disponible en este dispositivo.',
      locationDenied: 'Permite la geolocalización para estar disponible.',
      availabilityError: 'No se pudo actualizar tu disponibilidad.',
      mustBeAvailable: 'Activa tu disponibilidad antes de hacer una oferta.',
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

  constructor(
    public apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.apiService.currentLanguage();
  }

  public ngOnInit(): void {
    this.refreshDriverWorkspace();

    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Synchronisation légère : les nouvelles demandes apparaissent sans action manuelle.
    this.refreshTimerId = setInterval(() => {
      if (!document.hidden) {
        this.refreshDriverWorkspace();
      }
    }, 5000);
  }

  public ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    if (this.refreshTimerId !== null) {
      clearInterval(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }

  public ouvrirProposition(course: any): void {
    const courseId = Number(course?.id);

    if (!courseId) {
      return;
    }

    if (!this.chauffeur?.disponible) {
      this.propositionErreurs[courseId] =
        this.labels[this.currentLang].mustBeAvailable;
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
    const form = this.propositionForms[courseId];

    this.propositionMessages[courseId] = '';
    this.propositionErreurs[courseId] = '';

    if (!this.chauffeur?.disponible) {
      this.propositionErreurs[courseId] =
        this.labels[this.currentLang].mustBeAvailable;
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
      prixPropose,
      message: form?.message?.trim() || undefined,
      tempsEstimeMinutes:
        tempsEstime > 0 ? tempsEstime : undefined
    };

    this.propositionEnCours[courseId] = true;

    this.apiService.creerProposition(courseId, proposition).subscribe({
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

        // Recharge les données du chauffeur après l'envoi pour garder les compteurs cohérents.
        this.loadCoursesForCurrentDriver();
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


  private refreshDriverWorkspace(): void {
    this.loadDriverData();
    this.loadCoursesForCurrentDriver();
    this.loadCoursesDisponibles();
  }

  public toggleDisponibilite(): void {
    if (!this.chauffeur || this.disponibiliteEnCours) {
      return;
    }

    this.disponibiliteErreur = '';
    this.disponibiliteEnCours = true;

    if (this.chauffeur.disponible) {
      this.apiService.updateCurrentDriverAvailability(false).subscribe({
        next: chauffeur => this.applyAvailabilityResult(chauffeur),
        error: err => this.handleAvailabilityError(err)
      });
      return;
    }

    if (!navigator.geolocation) {
      this.disponibiliteErreur =
        this.labels[this.currentLang].locationUnavailable;
      this.disponibiliteEnCours = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.apiService.updateCurrentDriverPosition(
          position.coords.latitude,
          position.coords.longitude
        ).pipe(
          switchMap(() =>
            this.apiService.updateCurrentDriverAvailability(true)
          )
        ).subscribe({
          next: chauffeur => this.applyAvailabilityResult(chauffeur),
          error: err => this.handleAvailabilityError(err)
        });
      },
      () => {
        this.disponibiliteErreur =
          this.labels[this.currentLang].locationDenied;
        this.disponibiliteEnCours = false;
        this.cdr.detectChanges();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  private applyAvailabilityResult(chauffeur: ChauffeurResponseDTO): void {
    this.chauffeur = chauffeur;
    this.disponibiliteEnCours = false;
    this.disponibiliteErreur = '';
    this.cdr.detectChanges();
  }

  private handleAvailabilityError(err: any): void {
    console.error('Erreur mise à jour disponibilité chauffeur', err);
    this.disponibiliteErreur =
      err?.error?.message || this.labels[this.currentLang].availabilityError;
    this.disponibiliteEnCours = false;
    this.loadDriverData();
  }

  private loadDriverData(): void {
    this.apiService.getCurrentChauffeur().subscribe({
      next: (chauffeur: ChauffeurResponseDTO) => {
        console.log('CHAUFFEUR RECU =', chauffeur);

        this.chauffeur = chauffeur;
        this.stats.note = Number(chauffeur.noteMoyenne ?? 0);
        this.stats.soldeCredit = Number(chauffeur.soldeCredit ?? 0);
        this.cdr.detectChanges();
      },

      error: (err: unknown) => {
        console.error('Erreur chargement chauffeur connecté', err);
        this.chauffeur = undefined;
        this.cdr.detectChanges();
      }
    });
  }

  private loadCoursesForCurrentDriver(): void {
    this.apiService.getCurrentDriverCourses().subscribe({
      next: (courses: CourseResponseDTO[]) => {
        console.log('COURSES RECUES =', courses);
        this.applyCourseStats(courses);
        console.log('STATS APPLIQUEES =', this.stats);
      },

      error: (err: unknown) => {
        console.error('Erreur chargement courses chauffeur connecté', err);
        this.applyCourseStats([]);
      }
    });
  }

  private loadCoursesDisponibles(): void {
    forkJoin({
      courses: this.apiService.getCoursesEnAttente(),
      propositions: this.apiService.getCurrentDriverPropositions()
    }).subscribe({
      next: ({ courses, propositions }) => {
        const courseIdsDejaProposes = new Set(
          (propositions ?? []).map(proposition => Number(proposition.courseId))
        );

        this.coursesDisponibles = (Array.isArray(courses) ? courses : [])
          .filter(course => !courseIdsDejaProposes.has(Number(course.id)));

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

  private applyCourseStats(courses: CourseResponseDTO[]): void {
    const safeCourses = Array.isArray(courses) ? courses : [];

    const statutsEnCours = new Set([
      'ACCEPTEE',
      'CHAUFFEUR_EN_ROUTE',
      'CHAUFFEUR_ARRIVE',
      'EN_COURS'
    ]);

    const coursesEnCours = safeCourses.filter(course =>
      statutsEnCours.has(this.normalizeStatus(course.statut))
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

    this.cdr.detectChanges();
  }

  private normalizeStatus(status: unknown): string {
    return String(status ?? '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private extractPrice(course: CourseResponseDTO): number {
    const value = course?.prix ?? 0;

    return Number(value) || 0;
  }
}
