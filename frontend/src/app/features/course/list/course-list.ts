import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import {
  ApiService,
  ChauffeurResponseDTO,
  PassagerResponseDTO,
  PropositionCreateDTO,
  PropositionResponseDTO
} from '../../../core/api.service';

type Language = 'FR' | 'EN' | 'AR' | 'ES';

interface ProposalForm {
  prixPropose: number | null;
  distanceChauffeurDepart: number | null;
  tempsEstimeMinutes: number | null;
  message: string;
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseList implements OnInit {
  public courses: any[] = [];
  public coursesDisponibles: any[] = [];
  public mesCourses: any[] = [];

  public chauffeur?: ChauffeurResponseDTO;
  public passager?: PassagerResponseDTO;

  public loading = false;
  public errorMessage = '';
  public successMessage = '';
  public userRole = '';
  public currentLang: Language = 'FR';

  public activeProposalCourseId: number | null = null;
  public submittingProposalCourseId: number | null = null;
  public selectingProposalId: number | null = null;
  public loadingProposalsCourseId: number | null = null;

  public proposalForm: ProposalForm = this.createEmptyProposalForm();

  private readonly sentProposalCourseIds = new Set<number>();
  private readonly proposalsByCourse = new Map<number, PropositionResponseDTO[]>();

  public readonly texts = {
    FR: {
      title: 'Gestion des courses',
      subtitleAdmin: 'Supervision de toutes les courses DriveMe',
      subtitlePassenger: 'Suivi de vos demandes et choix du chauffeur',
      subtitleDriver: 'Consultez les demandes disponibles et proposez votre prix',
      dash: 'Dashboard',
      refresh: 'Rafraîchir',
      total: 'Total',
      waiting: 'En attente',
      accepted: 'Acceptées',
      finished: 'Terminées',
      myTrips: 'Mes courses',
      availableTrips: 'Courses disponibles',
      loading: 'Chargement des courses...',
      errorLoad: 'Erreur lors du chargement des courses.',
      dep: 'Départ',
      dest: 'Destination',
      pass: 'Passager',
      drv: 'Chauffeur',
      price: 'Prix demandé',
      status: 'Statut',
      propose: 'Faire une proposition',
      proposalSent: 'Proposition envoyée',
      editProposal: 'Modifier la saisie',
      cancel: 'Annuler',
      send: 'Envoyer la proposition',
      sending: 'Envoi en cours...',
      proposedPrice: 'Votre prix proposé',
      distance: 'Distance jusqu’au départ (km)',
      eta: 'Temps estimé (minutes)',
      message: 'Message au passager',
      messagePlaceholder: 'Ex. Je peux arriver rapidement.',
      invalidProposal: 'Saisissez un prix supérieur à 0.',
      proposalSuccess: 'Votre proposition a été envoyée.',
      proposalError: 'Impossible d’envoyer la proposition.',
      viewOffers: 'Voir les propositions',
      hideOffers: 'Masquer les propositions',
      offers: 'Propositions reçues',
      noOffers: 'Aucune proposition reçue pour le moment.',
      loadingOffers: 'Chargement des propositions...',
      choose: 'Choisir ce chauffeur',
      choosing: 'Sélection en cours...',
      chosen: 'Chauffeur choisi',
      chooseSuccess: 'Le chauffeur a été sélectionné.',
      chooseError: 'Impossible de sélectionner cette proposition.',
      driverNote: 'Note',
      distanceShort: 'Distance',
      etaShort: 'Arrivée estimée',
      end: 'Terminer la course',
      empty: 'Aucune course disponible.',
      emptyAvailable: 'Aucune nouvelle demande de course.',
      emptyDriverTrips: 'Aucune course ne vous est actuellement affectée.',
      waitingDriver: 'En attente d’un chauffeur',
      mad: 'MAD'
    },
    EN: {
      title: 'Ride Management',
      subtitleAdmin: 'Supervision of all DriveMe rides',
      subtitlePassenger: 'Track requests and select a driver',
      subtitleDriver: 'View available requests and submit your price',
      dash: 'Dashboard',
      refresh: 'Refresh',
      total: 'Total',
      waiting: 'Pending',
      accepted: 'Accepted',
      finished: 'Finished',
      myTrips: 'My rides',
      availableTrips: 'Available rides',
      loading: 'Loading rides...',
      errorLoad: 'Error loading rides.',
      dep: 'Departure',
      dest: 'Destination',
      pass: 'Passenger',
      drv: 'Driver',
      price: 'Requested price',
      status: 'Status',
      propose: 'Make an offer',
      proposalSent: 'Offer sent',
      editProposal: 'Edit input',
      cancel: 'Cancel',
      send: 'Send offer',
      sending: 'Sending...',
      proposedPrice: 'Your proposed price',
      distance: 'Distance to pickup (km)',
      eta: 'Estimated time (minutes)',
      message: 'Message to passenger',
      messagePlaceholder: 'E.g. I can arrive quickly.',
      invalidProposal: 'Enter a price greater than 0.',
      proposalSuccess: 'Your offer has been sent.',
      proposalError: 'Unable to send the offer.',
      viewOffers: 'View offers',
      hideOffers: 'Hide offers',
      offers: 'Offers received',
      noOffers: 'No offers received yet.',
      loadingOffers: 'Loading offers...',
      choose: 'Choose this driver',
      choosing: 'Selecting...',
      chosen: 'Driver selected',
      chooseSuccess: 'The driver has been selected.',
      chooseError: 'Unable to select this offer.',
      driverNote: 'Rating',
      distanceShort: 'Distance',
      etaShort: 'Estimated arrival',
      end: 'Finish ride',
      empty: 'No rides available.',
      emptyAvailable: 'No new ride requests.',
      emptyDriverTrips: 'No ride is currently assigned to you.',
      waitingDriver: 'Waiting for a driver',
      mad: 'MAD'
    },
    AR: {
      title: 'إدارة الرحلات',
      subtitleAdmin: 'الإشراف على جميع رحلات DriveMe',
      subtitlePassenger: 'تتبع الطلبات واختيار السائق',
      subtitleDriver: 'عرض الطلبات المتاحة واقتراح السعر',
      dash: 'لوحة التحكم',
      refresh: 'تحديث',
      total: 'الإجمالي',
      waiting: 'قيد الانتظار',
      accepted: 'مقبولة',
      finished: 'مكتملة',
      myTrips: 'رحلاتي',
      availableTrips: 'الرحلات المتاحة',
      loading: 'جاري تحميل الرحلات...',
      errorLoad: 'حدث خطأ أثناء تحميل الرحلات.',
      dep: 'نقطة الانطلاق',
      dest: 'الوجهة',
      pass: 'الراكب',
      drv: 'السائق',
      price: 'السعر المطلوب',
      status: 'الحالة',
      propose: 'تقديم عرض',
      proposalSent: 'تم إرسال العرض',
      editProposal: 'تعديل البيانات',
      cancel: 'إلغاء',
      send: 'إرسال العرض',
      sending: 'جاري الإرسال...',
      proposedPrice: 'السعر المقترح',
      distance: 'المسافة إلى نقطة الانطلاق (كم)',
      eta: 'الوقت المقدر (دقيقة)',
      message: 'رسالة إلى الراكب',
      messagePlaceholder: 'مثال: يمكنني الوصول بسرعة.',
      invalidProposal: 'أدخل سعراً أكبر من صفر.',
      proposalSuccess: 'تم إرسال عرضك.',
      proposalError: 'تعذر إرسال العرض.',
      viewOffers: 'عرض الاقتراحات',
      hideOffers: 'إخفاء الاقتراحات',
      offers: 'الاقتراحات المستلمة',
      noOffers: 'لا توجد اقتراحات حتى الآن.',
      loadingOffers: 'جاري تحميل الاقتراحات...',
      choose: 'اختيار هذا السائق',
      choosing: 'جاري الاختيار...',
      chosen: 'تم اختيار السائق',
      chooseSuccess: 'تم اختيار السائق.',
      chooseError: 'تعذر اختيار هذا العرض.',
      driverNote: 'التقييم',
      distanceShort: 'المسافة',
      etaShort: 'الوصول المتوقع',
      end: 'إنهاء الرحلة',
      empty: 'لا توجد رحلات.',
      emptyAvailable: 'لا توجد طلبات رحلات جديدة.',
      emptyDriverTrips: 'لا توجد رحلة مسندة إليك حالياً.',
      waitingDriver: 'في انتظار سائق',
      mad: 'MAD'
    },
    ES: {
      title: 'Gestión de viajes',
      subtitleAdmin: 'Supervisión de todos los viajes DriveMe',
      subtitlePassenger: 'Seguimiento de solicitudes y elección del conductor',
      subtitleDriver: 'Consulta solicitudes disponibles y propón tu precio',
      dash: 'Dashboard',
      refresh: 'Refrescar',
      total: 'Total',
      waiting: 'Pendientes',
      accepted: 'Aceptados',
      finished: 'Finalizados',
      myTrips: 'Mis viajes',
      availableTrips: 'Viajes disponibles',
      loading: 'Cargando viajes...',
      errorLoad: 'Error al cargar los viajes.',
      dep: 'Salida',
      dest: 'Destino',
      pass: 'Pasajero',
      drv: 'Conductor',
      price: 'Precio solicitado',
      status: 'Estado',
      propose: 'Hacer una oferta',
      proposalSent: 'Oferta enviada',
      editProposal: 'Editar datos',
      cancel: 'Cancelar',
      send: 'Enviar oferta',
      sending: 'Enviando...',
      proposedPrice: 'Tu precio propuesto',
      distance: 'Distancia a la recogida (km)',
      eta: 'Tiempo estimado (minutos)',
      message: 'Mensaje al pasajero',
      messagePlaceholder: 'Ej. Puedo llegar rápidamente.',
      invalidProposal: 'Introduce un precio superior a 0.',
      proposalSuccess: 'Tu oferta ha sido enviada.',
      proposalError: 'No se pudo enviar la oferta.',
      viewOffers: 'Ver ofertas',
      hideOffers: 'Ocultar ofertas',
      offers: 'Ofertas recibidas',
      noOffers: 'Todavía no hay ofertas.',
      loadingOffers: 'Cargando ofertas...',
      choose: 'Elegir este conductor',
      choosing: 'Seleccionando...',
      chosen: 'Conductor elegido',
      chooseSuccess: 'El conductor ha sido seleccionado.',
      chooseError: 'No se pudo seleccionar esta oferta.',
      driverNote: 'Valoración',
      distanceShort: 'Distancia',
      etaShort: 'Llegada estimada',
      end: 'Finalizar viaje',
      empty: 'No hay viajes disponibles.',
      emptyAvailable: 'No hay nuevas solicitudes.',
      emptyDriverTrips: 'No tienes ningún viaje asignado actualmente.',
      waitingDriver: 'Esperando conductor',
      mad: 'MAD'
    }
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.loadCourses(true);
  }

  public get pageSubtitle(): string {
    switch (this.userRole) {
      case 'ADMIN':
        return this.texts[this.currentLang].subtitleAdmin;
      case 'PASSAGER':
        return this.texts[this.currentLang].subtitlePassenger;
      case 'CHAUFFEUR':
        return this.texts[this.currentLang].subtitleDriver;
      default:
        return '';
    }
  }

  public get displayedCourses(): any[] {
    return this.userRole === 'CHAUFFEUR'
      ? [...this.coursesDisponibles, ...this.mesCourses]
      : this.courses;
  }

  public get totalCourses(): number {
    return this.displayedCourses.length;
  }

  public get waitingCoursesCount(): number {
    return this.countCoursesByStatus('EN_ATTENTE');
  }

  public get acceptedCoursesCount(): number {
    return this.countCoursesByStatus('ACCEPTEE');
  }

  public get finishedCoursesCount(): number {
    return this.countCoursesByStatus('TERMINEE');
  }

  public loadCourses(showLoading = true): void {
    if (showLoading) {
      this.loading = true;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.userRole = localStorage.getItem('userRole') || '';
    const email = localStorage.getItem('userEmail') || '';

    this.changeDetectorRef.markForCheck();

    switch (this.userRole) {
      case 'ADMIN':
        this.loadAdminCourses();
        return;
      case 'PASSAGER':
        this.loadPassengerCourses(email);
        return;
      case 'CHAUFFEUR':
        this.loadDriverCourses(email);
        return;
      default:
        this.clearAllCourses();
        this.errorMessage = 'Rôle utilisateur non reconnu.';
        this.changeDetectorRef.markForCheck();
    }
  }

  public openProposal(course: any): void {
    if (!course?.id || !this.chauffeur) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.activeProposalCourseId = course.id;
    this.proposalForm = {
      prixPropose: this.toPositiveNumber(course.prix),
      distanceChauffeurDepart: null,
      tempsEstimeMinutes: null,
      message: ''
    };
    this.changeDetectorRef.markForCheck();
  }

  public closeProposal(): void {
    this.activeProposalCourseId = null;
    this.proposalForm = this.createEmptyProposalForm();
    this.changeDetectorRef.markForCheck();
  }

  public submitProposal(course: any): void {
    const courseId = Number(course?.id);
    const chauffeurId = Number(this.chauffeur?.id);
    const prixPropose = this.toPositiveNumber(this.proposalForm.prixPropose);

    if (!courseId || !chauffeurId || prixPropose === null) {
      this.errorMessage = this.texts[this.currentLang].invalidProposal;
      this.changeDetectorRef.markForCheck();
      return;
    }

    const payload: PropositionCreateDTO = {
      courseId,
      chauffeurId,
      prixPropose,
      distanceChauffeurDepart:
        this.toOptionalPositiveNumber(this.proposalForm.distanceChauffeurDepart),
      tempsEstimeMinutes:
        this.toOptionalPositiveNumber(this.proposalForm.tempsEstimeMinutes),
      message: this.proposalForm.message.trim() || undefined
    };

    this.submittingProposalCourseId = courseId;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.creerProposition(payload)
      .pipe(
        finalize(() => {
          this.submittingProposalCourseId = null;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: proposal => {
          this.sentProposalCourseIds.add(courseId);
          this.addProposalToCache(proposal);
          this.activeProposalCourseId = null;
          this.proposalForm = this.createEmptyProposalForm();
          this.successMessage = this.texts[this.currentLang].proposalSuccess;
          this.changeDetectorRef.markForCheck();
        },
        error: err => {
          console.error('Erreur création proposition', err);
          this.errorMessage =
            err?.error?.message ||
            this.texts[this.currentLang].proposalError;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public hasSentProposal(courseId: number): boolean {
    return this.sentProposalCourseIds.has(Number(courseId));
  }

  public isProposalFormOpen(courseId: number): boolean {
    return this.activeProposalCourseId === Number(courseId);
  }

  public toggleCourseProposals(courseId: number): void {
    const id = Number(courseId);

    if (this.proposalsByCourse.has(id)) {
      this.proposalsByCourse.delete(id);
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.loadingProposalsCourseId = id;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.getPropositionsByCourse(id)
      .pipe(
        finalize(() => {
          this.loadingProposalsCourseId = null;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: proposals => {
          this.proposalsByCourse.set(id, Array.isArray(proposals) ? proposals : []);
          this.changeDetectorRef.markForCheck();
        },
        error: err => {
          console.error('Erreur chargement propositions', err);
          this.errorMessage =
            err?.error?.message ||
            this.texts[this.currentLang].errorLoad;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public areProposalsVisible(courseId: number): boolean {
    return this.proposalsByCourse.has(Number(courseId));
  }

  public getCourseProposals(courseId: number): PropositionResponseDTO[] {
    return this.proposalsByCourse.get(Number(courseId)) || [];
  }

  public chooseProposal(courseId: number, proposalId: number): void {
    if (!courseId || !proposalId || this.selectingProposalId !== null) {
      return;
    }

    this.selectingProposalId = proposalId;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.choisirProposition(courseId, proposalId)
      .pipe(
        finalize(() => {
          this.selectingProposalId = null;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: selected => {
          const current = this.getCourseProposals(courseId).map(proposal => ({
            ...proposal,
            statut: proposal.id === selected.id ? selected.statut : proposal.statut
          }));

          this.proposalsByCourse.set(courseId, current);
          this.successMessage = this.texts[this.currentLang].chooseSuccess;
          this.loadCourses(false);
        },
        error: err => {
          console.error('Erreur choix proposition', err);
          this.errorMessage =
            err?.error?.message ||
            this.texts[this.currentLang].chooseError;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public isSelectedProposal(proposal: PropositionResponseDTO): boolean {
    const status = this.normalizeStatus(proposal?.statut);
    return status === 'ACCEPTEE' || status === 'CHOISIE';
  }

  public finishCourse(courseId: number): void {
    if (!courseId || this.userRole !== 'CHAUFFEUR') {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.updateCourseStatus(courseId, 'TERMINEE')
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: () => this.loadCourses(false),
        error: err => {
          console.error('Erreur fin de course', err);
          this.errorMessage =
            err?.error?.message ||
            this.texts[this.currentLang].errorLoad;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  public statusClass(status: string): string {
    switch (this.normalizeStatus(status)) {
      case 'EN_ATTENTE':
        return 'status-waiting';
      case 'ACCEPTEE':
        return 'status-accepted';
      case 'TERMINEE':
        return 'status-finished';
      default:
        return 'status-default';
    }
  }

  public trackByCourseId(_index: number, course: any): number {
    return Number(course?.id);
  }

  public trackByProposalId(
    _index: number,
    proposal: PropositionResponseDTO
  ): number {
    return proposal.id;
  }

  private loadAdminCourses(): void {
    this.apiService.getCourses()
      .pipe(finalize(() => this.finishLoading()))
      .subscribe({
        next: data => {
          this.courses = this.toSafeArray(data);
          this.coursesDisponibles = [];
          this.mesCourses = [];
          this.changeDetectorRef.markForCheck();
        },
        error: err => this.handleLoadError('Erreur chargement courses admin', err)
      });
  }

  private loadPassengerCourses(email: string): void {
    if (!email) {
      this.handleMissingIdentity();
      return;
    }

    this.apiService.getPassagerByEmail(email).subscribe({
      next: passager => {
        this.passager = passager;

        this.apiService.getCoursesByPassager(passager.id)
          .pipe(finalize(() => this.finishLoading()))
          .subscribe({
            next: data => {
              this.courses = this.toSafeArray(data);
              this.coursesDisponibles = [];
              this.mesCourses = [];
              this.changeDetectorRef.markForCheck();
            },
            error: err =>
              this.handleLoadError('Erreur chargement courses passager', err)
          });
      },
      error: err =>
        this.handleLoadError('Erreur récupération passager connecté', err)
    });
  }

  private loadDriverCourses(email: string): void {
    if (!email) {
      this.handleMissingIdentity();
      return;
    }

    this.apiService.getChauffeurByEmail(email).subscribe({
      next: chauffeur => {
        this.chauffeur = chauffeur;

        forkJoin({
          disponibles: this.apiService.getCoursesEnAttente(),
          affectees: this.apiService.getCoursesByChauffeur(chauffeur.id),
          propositions: this.apiService.getPropositionsByChauffeur(chauffeur.id)
        })
          .pipe(finalize(() => this.finishLoading()))
          .subscribe({
            next: result => {
              this.courses = [];
              this.coursesDisponibles = this.toSafeArray(result.disponibles);
              this.mesCourses = this.toSafeArray(result.affectees);

              this.sentProposalCourseIds.clear();
              for (const proposal of result.propositions || []) {
                this.sentProposalCourseIds.add(Number(proposal.courseId));
                this.addProposalToCache(proposal);
              }

              this.changeDetectorRef.markForCheck();
            },
            error: err =>
              this.handleLoadError('Erreur chargement courses chauffeur', err)
          });
      },
      error: err =>
        this.handleLoadError('Erreur récupération chauffeur connecté', err)
    });
  }

  private addProposalToCache(proposal: PropositionResponseDTO): void {
    const courseId = Number(proposal.courseId);
    const current = this.proposalsByCourse.get(courseId) || [];
    const withoutDuplicate = current.filter(item => item.id !== proposal.id);
    this.proposalsByCourse.set(courseId, [...withoutDuplicate, proposal]);
  }

  private finishLoading(): void {
    this.loading = false;
    this.changeDetectorRef.markForCheck();
  }

  private handleLoadError(message: string, err: any): void {
    console.error(message, err);
    this.clearAllCourses();
    this.errorMessage =
      err?.error?.message ||
      this.texts[this.currentLang].errorLoad;
    this.changeDetectorRef.markForCheck();
  }

  private handleMissingIdentity(): void {
    this.clearAllCourses();
    this.errorMessage = this.texts[this.currentLang].errorLoad;
    this.changeDetectorRef.markForCheck();
  }

  private clearAllCourses(): void {
    this.courses = [];
    this.coursesDisponibles = [];
    this.mesCourses = [];
    this.loading = false;
  }

  private countCoursesByStatus(status: string): number {
    return this.displayedCourses.filter(
      course => this.normalizeStatus(course?.statut) === status
    ).length;
  }

  private createEmptyProposalForm(): ProposalForm {
    return {
      prixPropose: null,
      distanceChauffeurDepart: null,
      tempsEstimeMinutes: null,
      message: ''
    };
  }

  private toSafeArray(data: unknown): any[] {
    return Array.isArray(data) ? data : [];
  }

  private toPositiveNumber(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private toOptionalPositiveNumber(value: unknown): number | undefined {
    return this.toPositiveNumber(value) ?? undefined;
  }

  public normalizeStatus(status: unknown): string {
    return String(status ?? '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
