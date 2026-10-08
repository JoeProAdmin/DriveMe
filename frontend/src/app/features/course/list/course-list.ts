import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { DmButtonComponent } from '../../../shared/components/dm-button/dm-button';
import { CourseReview } from './course-review';

import {
  ApiService,
  CourseResponseDTO,
  ChauffeurResponseDTO,
  PassagerResponseDTO,
  PropositionCreateDTO,
  PropositionResponseDTO,
  PaiementMethode,
  PaiementResponseDTO
} from '../../../core/api.service';

type Language = 'FR' | 'EN' | 'AR' | 'ES';

interface PaymentForm {
  methode: PaiementMethode;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface ProposalForm {
  prixPropose: number | null;
  distanceChauffeurDepart: number | null;
  tempsEstimeMinutes: number | null;
  message: string;
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DmButtonComponent, CourseReview],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseList implements OnInit, OnDestroy {
  public courses: CourseResponseDTO[] = [];
  public coursesDisponibles: CourseResponseDTO[] = [];
  public mesCourses: CourseResponseDTO[] = [];
  public adminSearch = '';
  public adminStatusFilter = 'TOUS';
  public adminCategoryFilter = 'TOUTES';
  public adminPeriodFilter = 'TOUTES';
  public adminSort: 'RECENT' | 'ANCIEN' = 'RECENT';
  public expandedAdminCourseId: number | null = null;

  public chauffeur?: ChauffeurResponseDTO;
  public passager?: PassagerResponseDTO;

  public loading = false;
  public errorMessage = '';
  public successMessage = '';
  public userRole = '';

  public activeProposalCourseId: number | null = null;
  public submittingProposalCourseId: number | null = null;
  public selectingProposalId: number | null = null;
  public loadingProposalsCourseId: number | null = null;
  public activePaymentCourseId: number | null = null;
  public processingPaymentCourseId: number | null = null;
  public updatingStatusCourseId: number | null = null;
  public lastPayment: PaiementResponseDTO | null = null;
  public paymentForm: PaymentForm = this.createEmptyPaymentForm();

  public proposalForm: ProposalForm = this.createEmptyProposalForm();

  private refreshTimerId: ReturnType<typeof setInterval> | null = null;

  private readonly sentProposalCourseIds = new Set<number>();
  private readonly proposalsByCourse = new Map<number, PropositionResponseDTO[]>();

  public readonly texts = {
    FR: {
      serviceAll: 'Tous services', serviceTaxi: 'Taxi officiel', serviceTourist: 'Transporteur touristique agréé', servicePrivate: 'Chauffeur privé', passengerCount: 'Passagers', scheduledAt: 'Départ prévu', dayPeriod: 'Jour', nightPeriod: 'Nuit', largeLuggage: 'Bagages importants', adaptedVehicle: 'Véhicule adapté',
      title: 'Gestion des courses', subtitleAdmin: 'Supervision de toutes les courses DriveMe', subtitlePassenger: 'Suivi de vos demandes et choix du chauffeur', subtitleDriver: 'Consultez les demandes disponibles et proposez votre prix', dash: 'Dashboard', refresh: 'Rafraîchir', total: 'Total', waiting: 'En attente', accepted: 'Acceptées', finished: 'Terminées', myTrips: 'Mes courses', availableTrips: 'Courses disponibles', loading: 'Chargement des courses...', errorLoad: 'Erreur lors du chargement des courses.', dep: 'Départ', dest: 'Destination', pass: 'Passager', drv: 'Chauffeur', price: 'Prix demandé', status: 'Statut', propose: 'Faire une proposition', proposalSent: 'Proposition envoyée', editProposal: 'Modifier la saisie', cancel: 'Annuler', send: 'Envoyer la proposition', sending: 'Envoi en cours...', proposedPrice: 'Votre prix proposé', distance: 'Distance jusqu’au départ (km)', eta: 'Temps estimé (minutes)', message: 'Message au passager', messagePlaceholder: 'Ex. Je peux arriver rapidement.', invalidProposal: 'Saisissez un prix supérieur à 0.', proposalSuccess: 'Votre proposition a été envoyée.', proposalError: 'Impossible d’envoyer la proposition.', viewOffers: 'Voir les propositions', hideOffers: 'Masquer les propositions', offers: 'Propositions reçues', noOffers: 'Aucune proposition reçue pour le moment.', loadingOffers: 'Chargement des propositions...', choose: 'Choisir ce chauffeur', choosing: 'Sélection en cours...', chosen: 'Chauffeur choisi', chooseSuccess: 'Le chauffeur a été sélectionné.', chooseError: 'Impossible de sélectionner cette proposition.', driverNote: 'Note', distanceShort: 'Distance', etaShort: 'Arrivée estimée', startRoute: 'Je pars vers le passager', arrived: 'Je suis arrivé', startRide: 'Démarrer la course', end: 'Terminer la course', statusUpdating: 'Mise à jour...', statusUpdateSuccess: 'Le statut de la course a été mis à jour.', statusUpdateError: 'Impossible de mettre à jour le statut de la course.', empty: 'Aucune course disponible.', emptyAvailable: 'Aucune nouvelle demande de course.', emptyDriverTrips: 'Aucune course ne vous est actuellement affectée.', waitingDriver: 'En attente d’un chauffeur', mad: 'MAD', pay: 'Payer la course', paymentTitle: 'Paiement de la course', paymentMethod: 'Moyen de paiement', card: 'Carte bancaire', cash: 'Espèces', online: 'Paiement en ligne', cardName: 'Nom du titulaire', cardNumber: 'Numéro de carte', expiry: 'MM/AA', cvc: 'CVC', paymentCancel: 'Annuler', paymentConfirm: 'Valider le paiement', paymentProcessing: 'Traitement en cours...', paymentSuccess: 'Paiement validé avec succès.', paymentError: 'Impossible de valider le paiement.', invalidCard: 'Veuillez compléter correctement les données de carte.', paid: 'Paiement validé', paymentPending: 'Paiement requis', paymentInfo: 'Le montant est déterminé par la course et ne peut pas être modifié.'
    },
    EN: {
      serviceAll: 'All services', serviceTaxi: 'Official taxi', serviceTourist: 'Licensed tourist transport', servicePrivate: 'Private driver', passengerCount: 'Passengers', scheduledAt: 'Scheduled departure', dayPeriod: 'Day', nightPeriod: 'Night', largeLuggage: 'Large luggage', adaptedVehicle: 'Adapted vehicle',
      title: 'Ride management', subtitleAdmin: 'Supervision of all DriveMe rides', subtitlePassenger: 'Track your requests and select a driver', subtitleDriver: 'View available requests and submit your price', dash: 'Dashboard', refresh: 'Refresh', total: 'Total', waiting: 'Pending', accepted: 'Accepted', finished: 'Finished', myTrips: 'My rides', availableTrips: 'Available rides', loading: 'Loading rides...', errorLoad: 'Error loading rides.', dep: 'Departure', dest: 'Destination', pass: 'Passenger', drv: 'Driver', price: 'Requested price', status: 'Status', propose: 'Make an offer', proposalSent: 'Offer sent', editProposal: 'Edit input', cancel: 'Cancel', send: 'Send offer', sending: 'Sending...', proposedPrice: 'Your proposed price', distance: 'Distance to pickup (km)', eta: 'Estimated time (minutes)', message: 'Message to passenger', messagePlaceholder: 'E.g. I can arrive quickly.', invalidProposal: 'Enter a price greater than 0.', proposalSuccess: 'Your offer has been sent.', proposalError: 'Unable to send the offer.', viewOffers: 'View offers', hideOffers: 'Hide offers', offers: 'Offers received', noOffers: 'No offers received yet.', loadingOffers: 'Loading offers...', choose: 'Choose this driver', choosing: 'Selecting...', chosen: 'Driver selected', chooseSuccess: 'The driver has been selected.', chooseError: 'Unable to select this offer.', driverNote: 'Rating', distanceShort: 'Distance', etaShort: 'Estimated arrival', startRoute: 'Drive to passenger', arrived: 'I have arrived', startRide: 'Start ride', end: 'Finish ride', statusUpdating: 'Updating...', statusUpdateSuccess: 'The ride status has been updated.', statusUpdateError: 'Unable to update the ride status.', empty: 'No rides available.', emptyAvailable: 'No new ride requests.', emptyDriverTrips: 'No ride is currently assigned to you.', waitingDriver: 'Waiting for a driver', mad: 'MAD', pay: 'Pay for ride', paymentTitle: 'Ride payment', paymentMethod: 'Payment method', card: 'Bank card', cash: 'Cash', online: 'Online payment', cardName: 'Cardholder name', cardNumber: 'Card number', expiry: 'MM/YY', cvc: 'CVC', paymentCancel: 'Cancel', paymentConfirm: 'Confirm payment', paymentProcessing: 'Processing...', paymentSuccess: 'Payment validated successfully.', paymentError: 'Unable to validate payment.', invalidCard: 'Please complete the card details correctly.', paid: 'Payment validated', paymentPending: 'Payment required', paymentInfo: 'The amount is determined by the ride and cannot be changed.'
    },
    AR: {
      serviceAll: 'جميع الخدمات', serviceTaxi: 'سيارة أجرة رسمية', serviceTourist: 'ناقل سياحي معتمد', servicePrivate: 'سائق خاص', passengerCount: 'الركاب', scheduledAt: 'موعد الانطلاق', dayPeriod: 'نهار', nightPeriod: 'ليل', largeLuggage: 'أمتعة كبيرة', adaptedVehicle: 'مركبة ملائمة',
      title: 'إدارة الرحلات', subtitleAdmin: 'الإشراف على جميع رحلات DriveMe', subtitlePassenger: 'تتبع طلباتك واختيار السائق', subtitleDriver: 'عرض الطلبات المتاحة واقتراح السعر', dash: 'لوحة التحكم', refresh: 'تحديث', total: 'الإجمالي', waiting: 'قيد الانتظار', accepted: 'مقبولة', finished: 'مكتملة', myTrips: 'رحلاتي', availableTrips: 'الرحلات المتاحة', loading: 'جاري تحميل الرحلات...', errorLoad: 'حدث خطأ أثناء تحميل الرحلات.', dep: 'نقطة الانطلاق', dest: 'الوجهة', pass: 'الراكب', drv: 'السائق', price: 'السعر المطلوب', status: 'الحالة', propose: 'تقديم عرض', proposalSent: 'تم إرسال العرض', editProposal: 'تعديل البيانات', cancel: 'إلغاء', send: 'إرسال العرض', sending: 'جاري الإرسال...', proposedPrice: 'السعر المقترح', distance: 'المسافة إلى نقطة الانطلاق (كم)', eta: 'الوقت المقدر (دقيقة)', message: 'رسالة إلى الراكب', messagePlaceholder: 'مثال: يمكنني الوصول بسرعة.', invalidProposal: 'أدخل سعراً أكبر من صفر.', proposalSuccess: 'تم إرسال عرضك.', proposalError: 'تعذر إرسال العرض.', viewOffers: 'عرض الاقتراحات', hideOffers: 'إخفاء الاقتراحات', offers: 'الاقتراحات المستلمة', noOffers: 'لا توجد اقتراحات حتى الآن.', loadingOffers: 'جاري تحميل الاقتراحات...', choose: 'اختيار هذا السائق', choosing: 'جاري الاختيار...', chosen: 'تم اختيار السائق', chooseSuccess: 'تم اختيار السائق.', chooseError: 'تعذر اختيار هذا العرض.', driverNote: 'التقييم', distanceShort: 'المسافة', etaShort: 'الوصول المتوقع', startRoute: 'التوجه إلى الراكب', arrived: 'لقد وصلت', startRide: 'بدء الرحلة', end: 'إنهاء الرحلة', statusUpdating: 'جاري التحديث...', statusUpdateSuccess: 'تم تحديث حالة الرحلة.', statusUpdateError: 'تعذر تحديث حالة الرحلة.', empty: 'لا توجد رحلات.', emptyAvailable: 'لا توجد طلبات رحلات جديدة.', emptyDriverTrips: 'لا توجد رحلة مسندة إليك حالياً.', waitingDriver: 'في انتظار سائق', mad: 'MAD', pay: 'دفع ثمن الرحلة', paymentTitle: 'دفع الرحلة', paymentMethod: 'وسيلة الدفع', card: 'بطاقة بنكية', cash: 'نقداً', online: 'الدفع عبر الإنترنت', cardName: 'اسم حامل البطاقة', cardNumber: 'رقم البطاقة', expiry: 'شهر/سنة', cvc: 'CVC', paymentCancel: 'إلغاء', paymentConfirm: 'تأكيد الدفع', paymentProcessing: 'جاري المعالجة...', paymentSuccess: 'تم تأكيد الدفع بنجاح.', paymentError: 'تعذر تأكيد الدفع.', invalidCard: 'يرجى إكمال بيانات البطاقة بشكل صحيح.', paid: 'تم الدفع', paymentPending: 'الدفع مطلوب', paymentInfo: 'يتم تحديد المبلغ من خلال الرحلة ولا يمكن تغييره.'
    },
    ES: {
      serviceAll: 'Todos los servicios', serviceTaxi: 'Taxi oficial', serviceTourist: 'Transporte turístico autorizado', servicePrivate: 'Conductor privado', passengerCount: 'Pasajeros', scheduledAt: 'Salida prevista', dayPeriod: 'Día', nightPeriod: 'Noche', largeLuggage: 'Equipaje voluminoso', adaptedVehicle: 'Vehículo adaptado',
      title: 'Gestión de viajes', subtitleAdmin: 'Supervisión de todos los viajes DriveMe', subtitlePassenger: 'Seguimiento de solicitudes y elección del conductor', subtitleDriver: 'Consulta solicitudes disponibles y propón tu precio', dash: 'Dashboard', refresh: 'Actualizar', total: 'Total', waiting: 'Pendientes', accepted: 'Aceptados', finished: 'Finalizados', myTrips: 'Mis viajes', availableTrips: 'Viajes disponibles', loading: 'Cargando viajes...', errorLoad: 'Error al cargar los viajes.', dep: 'Salida', dest: 'Destino', pass: 'Pasajero', drv: 'Conductor', price: 'Precio solicitado', status: 'Estado', propose: 'Hacer una oferta', proposalSent: 'Oferta enviada', editProposal: 'Editar datos', cancel: 'Cancelar', send: 'Enviar oferta', sending: 'Enviando...', proposedPrice: 'Tu precio propuesto', distance: 'Distancia a la recogida (km)', eta: 'Tiempo estimado (minutos)', message: 'Mensaje al pasajero', messagePlaceholder: 'Ej. Puedo llegar rápidamente.', invalidProposal: 'Introduce un precio superior a 0.', proposalSuccess: 'Tu oferta ha sido enviada.', proposalError: 'No se pudo enviar la oferta.', viewOffers: 'Ver ofertas', hideOffers: 'Ocultar ofertas', offers: 'Ofertas recibidas', noOffers: 'Todavía no hay ofertas.', loadingOffers: 'Cargando ofertas...', choose: 'Elegir este conductor', choosing: 'Seleccionando...', chosen: 'Conductor elegido', chooseSuccess: 'El conductor ha sido seleccionado.', chooseError: 'No se pudo seleccionar esta oferta.', driverNote: 'Valoración', distanceShort: 'Distancia', etaShort: 'Llegada estimada', startRoute: 'Ir hacia el pasajero', arrived: 'He llegado', startRide: 'Iniciar viaje', end: 'Finalizar viaje', statusUpdating: 'Actualizando...', statusUpdateSuccess: 'El estado del viaje se ha actualizado.', statusUpdateError: 'No se pudo actualizar el estado del viaje.', empty: 'No hay viajes disponibles.', emptyAvailable: 'No hay nuevas solicitudes.', emptyDriverTrips: 'No tienes ningún viaje asignado actualmente.', waitingDriver: 'Esperando conductor', mad: 'MAD', pay: 'Pagar el viaje', paymentTitle: 'Pago del viaje', paymentMethod: 'Método de pago', card: 'Tarjeta bancaria', cash: 'Efectivo', online: 'Pago en línea', cardName: 'Titular de la tarjeta', cardNumber: 'Número de tarjeta', expiry: 'MM/AA', cvc: 'CVC', paymentCancel: 'Cancelar', paymentConfirm: 'Confirmar pago', paymentProcessing: 'Procesando...', paymentSuccess: 'Pago validado correctamente.', paymentError: 'No se pudo validar el pago.', invalidCard: 'Complete correctamente los datos de la tarjeta.', paid: 'Pago validado', paymentPending: 'Pago requerido', paymentInfo: 'El importe lo determina el viaje y no se puede modificar.'
    }
  };
  public readonly adminTexts = {
    FR: { active: 'Actives', cancelled: 'Annulées', paymentRequired: 'Paiement requis', search: 'Rechercher par n°, passager, chauffeur ou trajet', allStatuses: 'Tous les statuts', allCategories: 'Toutes les catégories', allPeriods: 'Jour et nuit', recent: 'Plus récentes', oldest: 'Plus anciennes', reset: 'Réinitialiser', results: 'résultat(s)', ride: 'Course', created: 'Créée le', route: 'Trajet', people: 'Personnes', requested: 'Demandé', final: 'Final', payment: 'Paiement', offers: 'proposition(s)', details: 'Voir le détail', hide: 'Masquer le détail', identifiers: 'Identifiants', initialPrice: 'Prix initial', finalPrice: 'Prix final', paymentAmount: 'Montant payé', method: 'Méthode', timeline: 'Chronologie', noFiltered: 'Aucune course ne correspond aux filtres.', passenger: 'Passager', driver: 'Chauffeur', waiting: 'Non attribué' },
    EN: { active: 'Active', cancelled: 'Cancelled', paymentRequired: 'Payment required', search: 'Search by no., passenger, driver or route', allStatuses: 'All statuses', allCategories: 'All categories', allPeriods: 'Day and night', recent: 'Newest first', oldest: 'Oldest first', reset: 'Reset', results: 'result(s)', ride: 'Ride', created: 'Created', route: 'Route', people: 'People', requested: 'Requested', final: 'Final', payment: 'Payment', offers: 'offer(s)', details: 'View details', hide: 'Hide details', identifiers: 'Identifiers', initialPrice: 'Initial price', finalPrice: 'Final price', paymentAmount: 'Paid amount', method: 'Method', timeline: 'Timeline', noFiltered: 'No ride matches these filters.', passenger: 'Passenger', driver: 'Driver', waiting: 'Unassigned' },
    AR: { active: 'نشطة', cancelled: 'ملغاة', paymentRequired: 'الدفع مطلوب', search: 'البحث بالرقم أو الراكب أو السائق أو المسار', allStatuses: 'جميع الحالات', allCategories: 'جميع الفئات', allPeriods: 'النهار والليل', recent: 'الأحدث أولاً', oldest: 'الأقدم أولاً', reset: 'إعادة ضبط', results: 'نتيجة', ride: 'رحلة', created: 'تاريخ الإنشاء', route: 'المسار', people: 'الأشخاص', requested: 'المطلوب', final: 'النهائي', payment: 'الدفع', offers: 'عرض', details: 'عرض التفاصيل', hide: 'إخفاء التفاصيل', identifiers: 'المعرفات', initialPrice: 'السعر الأولي', finalPrice: 'السعر النهائي', paymentAmount: 'المبلغ المدفوع', method: 'الطريقة', timeline: 'التسلسل الزمني', noFiltered: 'لا توجد رحلة تطابق عوامل التصفية.', passenger: 'الراكب', driver: 'السائق', waiting: 'غير معيّن' },
    ES: { active: 'Activos', cancelled: 'Cancelados', paymentRequired: 'Pago requerido', search: 'Buscar por n.º, pasajero, conductor o trayecto', allStatuses: 'Todos los estados', allCategories: 'Todas las categorías', allPeriods: 'Día y noche', recent: 'Más recientes', oldest: 'Más antiguos', reset: 'Restablecer', results: 'resultado(s)', ride: 'Viaje', created: 'Creado', route: 'Trayecto', people: 'Personas', requested: 'Solicitado', final: 'Final', payment: 'Pago', offers: 'oferta(s)', details: 'Ver detalles', hide: 'Ocultar detalles', identifiers: 'Identificadores', initialPrice: 'Precio inicial', finalPrice: 'Precio final', paymentAmount: 'Importe pagado', method: 'Método', timeline: 'Cronología', noFiltered: 'Ningún viaje coincide con los filtros.', passenger: 'Pasajero', driver: 'Conductor', waiting: 'Sin asignar' }
  };
  constructor(
    public readonly apiService: ApiService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public get currentLang(): Language {
    return this.apiService.currentLanguage().toUpperCase() as Language;
  }

  public ngOnInit(): void {
    this.loadCourses(true);

    // Met à jour automatiquement les propositions et les changements de statut.
    this.refreshTimerId = setInterval(() => {
      if (!document.hidden && !this.loading && this.selectingProposalId === null && this.processingPaymentCourseId === null && this.updatingStatusCourseId === null) {
        this.loadCourses(false);
      }
    }, 5000);
  }

  public ngOnDestroy(): void {
    if (this.refreshTimerId !== null) {
      clearInterval(this.refreshTimerId);
      this.refreshTimerId = null;
    }
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

  public get activeCoursesCount(): number {
    return this.displayedCourses.filter(course =>
      ['ACCEPTEE', 'CHAUFFEUR_EN_ROUTE', 'CHAUFFEUR_ARRIVE', 'EN_COURS']
        .includes(this.normalizeStatus(course.statut))
    ).length;
  }

  public get cancelledCoursesCount(): number {
    return this.countCoursesByStatus('ANNULEE');
  }

  public get paymentRequiredCount(): number {
    return this.displayedCourses.filter(course =>
      this.normalizeStatus(course.statut) === 'TERMINEE'
      && this.normalizeStatus(course.paiementStatut) !== 'PAYE'
    ).length;
  }

  public get filteredAdminCourses(): CourseResponseDTO[] {
    const query = this.adminSearch.trim().toLowerCase();
    return this.courses
      .filter(course => !query || [course.id, course.passagerNom, course.chauffeurNom,
        course.adresseDepart, course.adresseArrivee]
        .some(value => String(value ?? '').toLowerCase().includes(query)))
      .filter(course => this.adminStatusFilter === 'TOUS'
        || this.normalizeStatus(course.statut) === this.adminStatusFilter)
      .filter(course => this.adminCategoryFilter === 'TOUTES'
        || String(course.categorieService) === this.adminCategoryFilter)
      .filter(course => this.adminPeriodFilter === 'TOUTES'
        || String(course.periodeCourse) === this.adminPeriodFilter)
      .sort((a, b) => {
        const difference = new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
        return this.adminSort === 'RECENT' ? difference : -difference;
      });
  }

  public toggleAdminDetails(courseId: number): void {
    this.expandedAdminCourseId = this.expandedAdminCourseId === courseId ? null : courseId;
  }

  public isAdminDetailsExpanded(courseId: number): boolean {
    return this.expandedAdminCourseId === courseId;
  }

  public resetAdminFilters(): void {
    this.adminSearch = '';
    this.adminStatusFilter = 'TOUS';
    this.adminCategoryFilter = 'TOUTES';
    this.adminPeriodFilter = 'TOUTES';
    this.adminSort = 'RECENT';
  }

  public formatDateTime(value: string | null | undefined): string {
    return value ? this.formatScheduledDeparture(value) : '—';
  }

  public statusLabel(status: unknown): string {
    const labels: Record<Language, Record<string, string>> = {
      FR: { EN_ATTENTE: 'En attente', PROPOSITION_RECUE: 'Proposition reçue', ACCEPTEE: 'Acceptée', CHAUFFEUR_EN_ROUTE: 'Chauffeur en route', CHAUFFEUR_ARRIVE: 'Chauffeur arrivé', EN_COURS: 'En cours', TERMINEE: 'Terminée', ANNULEE: 'Annulée', PAYE: 'Payée' },
      EN: { EN_ATTENTE: 'Pending', PROPOSITION_RECUE: 'Offer received', ACCEPTEE: 'Accepted', CHAUFFEUR_EN_ROUTE: 'Driver on the way', CHAUFFEUR_ARRIVE: 'Driver arrived', EN_COURS: 'In progress', TERMINEE: 'Finished', ANNULEE: 'Cancelled', PAYE: 'Paid' },
      AR: { EN_ATTENTE: 'قيد الانتظار', PROPOSITION_RECUE: 'تم استلام عرض', ACCEPTEE: 'مقبولة', CHAUFFEUR_EN_ROUTE: 'السائق في الطريق', CHAUFFEUR_ARRIVE: 'وصل السائق', EN_COURS: 'جارية', TERMINEE: 'مكتملة', ANNULEE: 'ملغاة', PAYE: 'مدفوعة' },
      ES: { EN_ATTENTE: 'Pendiente', PROPOSITION_RECUE: 'Oferta recibida', ACCEPTEE: 'Aceptada', CHAUFFEUR_EN_ROUTE: 'Conductor en camino', CHAUFFEUR_ARRIVE: 'Conductor llegado', EN_COURS: 'En curso', TERMINEE: 'Finalizada', ANNULEE: 'Cancelada', PAYE: 'Pagada' }
    };
    const normalized = this.normalizeStatus(status);
    return labels[this.currentLang][normalized] || normalized.replaceAll('_', ' ');
  }

  public adminPrice(course: CourseResponseDTO): number {
    return Number(course.prixFinal ?? course.prix ?? course.prixInitial ?? 0);
  }

  public timelineReached(course: CourseResponseDTO, step: string): boolean {
    const order = ['EN_ATTENTE', 'PROPOSITION_RECUE', 'ACCEPTEE', 'CHAUFFEUR_EN_ROUTE',
      'CHAUFFEUR_ARRIVE', 'EN_COURS', 'TERMINEE'];
    const current = this.normalizeStatus(course.statut);
    if (current === 'ANNULEE') return step === 'EN_ATTENTE';
    return order.indexOf(current) >= order.indexOf(step);
  }

  public loadCourses(showLoading = true): void {
    if (showLoading) {
      this.loading = true;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.userRole = localStorage.getItem('userRole') || '';
    this.changeDetectorRef.markForCheck();

    switch (this.userRole) {
      case 'ADMIN':
        this.loadAdminCourses();
        return;
      case 'PASSAGER':
        this.loadPassengerCourses();
        return;
      case 'CHAUFFEUR':
        this.loadDriverCourses();
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
    const prixPropose = this.toPositiveNumber(this.proposalForm.prixPropose);

    if (!courseId || !this.chauffeur || prixPropose === null) {
      this.errorMessage = this.texts[this.currentLang].invalidProposal;
      this.changeDetectorRef.markForCheck();
      return;
    }

    const payload: PropositionCreateDTO = {
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

    this.apiService.creerProposition(courseId, payload)
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

    this.apiService.accepterProposition(proposalId)
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

  public openPayment(course: any): void {
    if (!course?.id || this.normalizeStatus(course.statut) !== 'TERMINEE' || this.hasPaidCourse(course.id)) {
      return;
    }
    this.activePaymentCourseId = Number(course.id);
    this.lastPayment = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.paymentForm = this.createEmptyPaymentForm();
    this.changeDetectorRef.markForCheck();
  }

  public closePayment(): void {
    this.activePaymentCourseId = null;
    this.paymentForm = this.createEmptyPaymentForm();
    this.changeDetectorRef.markForCheck();
  }

  public selectPaymentMethod(methode: PaiementMethode): void {
    this.paymentForm.methode = methode;
    this.changeDetectorRef.markForCheck();
  }

  public submitPayment(course: any): void {
    const courseId = Number(course?.id);
    if (!courseId || this.processingPaymentCourseId !== null) {
      return;
    }

    if (this.paymentForm.methode === 'CARTE' && !this.isCardFormValid()) {
      this.errorMessage = this.texts[this.currentLang].invalidCard;
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.processingPaymentCourseId = courseId;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.validerPaiement({
      courseId,
      methode: this.paymentForm.methode
    }).pipe(
      finalize(() => {
        this.processingPaymentCourseId = null;
        this.changeDetectorRef.markForCheck();
      })
    ).subscribe({
      next: payment => {
        this.lastPayment = payment;
        this.courses = this.courses.map(item =>
          Number(item?.id) === courseId
            ? { ...item, paiementStatut: payment.statut }
            : item
        );
        this.activePaymentCourseId = null;
        this.paymentForm = this.createEmptyPaymentForm();
        this.successMessage = this.texts[this.currentLang].paymentSuccess;
        this.loadCourses(false);
      },
      error: err => {
        console.error('Erreur paiement course', err);
        this.errorMessage = err?.error?.message || this.texts[this.currentLang].paymentError;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  public hasPaidCourse(courseId: number): boolean {
    const course = this.courses.find(item => Number(item?.id) === Number(courseId));
    return this.normalizeStatus(course?.paiementStatut) === 'PAYE';
  }

  public canReviewCourse(course: any): boolean {
    return this.userRole === 'PASSAGER'
      && this.normalizeStatus(course?.statut) === 'TERMINEE'
      && this.normalizeStatus(course?.paiementStatut) === 'PAYE'
      && course?.avisDepose !== true;
  }

  public onReviewSubmitted(courseId: number): void {
    this.courses = this.courses.map(course =>
      Number(course?.id) === Number(courseId)
        ? { ...course, avisDepose: true }
        : course
    );
    this.changeDetectorRef.markForCheck();
  }

  public isPaymentOpen(courseId: number): boolean {
    return this.activePaymentCourseId === Number(courseId);
  }

  public onCardNumberChange(value: string): void {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 19);
    this.paymentForm.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  public onExpiryChange(value: string): void {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 4);
    this.paymentForm.expiry = digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  }

  public onCvcChange(value: string): void {
    this.paymentForm.cvc = String(value || '').replace(/\D/g, '').slice(0, 4);
  }

  private isCardFormValid(): boolean {
    const cardName = this.paymentForm.cardName.trim();
    const cardDigits = this.paymentForm.cardNumber.replace(/\D/g, '');
    const expiryDigits = this.paymentForm.expiry.replace(/\D/g, '');
    const cvcDigits = this.paymentForm.cvc.replace(/\D/g, '');

    if (cardName.length < 2 || cardDigits.length < 12 || cardDigits.length > 19) {
      return false;
    }

    if (expiryDigits.length !== 4 || !/^\d{3,4}$/.test(cvcDigits)) {
      return false;
    }

    const month = Number(expiryDigits.slice(0, 2));
    const year = Number(`20${expiryDigits.slice(2)}`);
    if (month < 1 || month > 12) {
      return false;
    }

    const now = new Date();
    const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);
    return expiryDate >= now;
  }

  public canDriverAdvance(status: unknown): boolean {
    return ['ACCEPTEE', 'CHAUFFEUR_EN_ROUTE', 'CHAUFFEUR_ARRIVE', 'EN_COURS']
      .includes(this.normalizeStatus(status));
  }

  public getDriverActionLabel(status: unknown): string {
    switch (this.normalizeStatus(status)) {
      case 'ACCEPTEE':
        return this.texts[this.currentLang].startRoute;
      case 'CHAUFFEUR_EN_ROUTE':
        return this.texts[this.currentLang].arrived;
      case 'CHAUFFEUR_ARRIVE':
        return this.texts[this.currentLang].startRide;
      case 'EN_COURS':
        return this.texts[this.currentLang].end;
      default:
        return '';
    }
  }

  public cancellingCourseId: number | null = null;

  public readonly cancellationTexts = {
    FR: { button: 'Annuler ma demande', confirm: 'Annuler cette demande de course ?', success: 'Votre demande a été annulée.', failure: 'Impossible d’annuler cette demande.' },
    EN: { button: 'Cancel my request', confirm: 'Cancel this ride request?', success: 'Your request has been cancelled.', failure: 'Unable to cancel this request.' },
    AR: { button: 'إلغاء طلبي', confirm: 'هل تريد إلغاء طلب الرحلة؟', success: 'تم إلغاء طلبك.', failure: 'تعذر إلغاء الطلب.' },
    ES: { button: 'Cancelar mi solicitud', confirm: '¿Cancelar esta solicitud de viaje?', success: 'Tu solicitud ha sido cancelada.', failure: 'No se pudo cancelar la solicitud.' }
  };

  public canCancelPassengerCourse(course: any): boolean {
    const status = this.normalizeStatus(course?.statut);
    return this.userRole === 'PASSAGER'
      && course?.chauffeurId == null
      && (status === 'EN_ATTENTE' || status === 'PROPOSITION_RECUE');
  }

  public cancelPassengerCourse(course: any): void {
    const courseId = Number(course?.id);
    if (!courseId || !this.canCancelPassengerCourse(course)
        || this.cancellingCourseId !== null || this.selectingProposalId !== null) return;

    const labels = this.cancellationTexts[this.currentLang];
    if (!window.confirm(labels.confirm)) return;

    this.cancellingCourseId = courseId;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.cancelCurrentPassengerCourse(courseId).pipe(
      finalize(() => {
        this.cancellingCourseId = null;
        this.changeDetectorRef.markForCheck();
      })
    ).subscribe({
      next: updatedCourse => {
        this.courses = this.courses.map(item =>
          Number(item?.id) === courseId ? updatedCourse : item);
        this.proposalsByCourse.delete(courseId);
        this.successMessage = labels.success;
        this.changeDetectorRef.markForCheck();
        this.loadCourses(false);
      },
      error: err => {
        this.errorMessage = err?.error?.message || labels.failure;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  public updateDriverCourseStatus(course: any): void {
    const courseId = Number(course?.id);
    const nextStatus = this.getNextDriverStatus(course?.statut);

    if (!courseId || !nextStatus || this.userRole !== 'CHAUFFEUR' || this.updatingStatusCourseId !== null) {
      return;
    }

    this.updatingStatusCourseId = courseId;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.markForCheck();

    this.apiService.updateCurrentDriverCourseStatus(courseId, nextStatus)
      .pipe(
        finalize(() => {
          this.updatingStatusCourseId = null;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: updatedCourse => {
          const index = this.mesCourses.findIndex(item => Number(item?.id) === courseId);
          if (index >= 0) {
            this.mesCourses = [
              ...this.mesCourses.slice(0, index),
              updatedCourse,
              ...this.mesCourses.slice(index + 1)
            ];
          }
          this.successMessage = this.texts[this.currentLang].statusUpdateSuccess;
          this.changeDetectorRef.markForCheck();
        },
        error: err => {
          console.error('Erreur mise à jour du statut chauffeur', err);
          this.errorMessage =
            err?.error?.message ||
            this.texts[this.currentLang].statusUpdateError;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private getNextDriverStatus(status: unknown): string | null {
    switch (this.normalizeStatus(status)) {
      case 'ACCEPTEE':
        return 'CHAUFFEUR_EN_ROUTE';
      case 'CHAUFFEUR_EN_ROUTE':
        return 'CHAUFFEUR_ARRIVE';
      case 'CHAUFFEUR_ARRIVE':
        return 'EN_COURS';
      case 'EN_COURS':
        return 'TERMINEE';
      default:
        return null;
    }
  }

  public goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  public statusClass(status: string): string {
    switch (this.normalizeStatus(status)) {
      case 'EN_ATTENTE':
        return 'status-waiting';
      case 'PROPOSITION_RECUE':
        return 'status-proposal';
      case 'ACCEPTEE':
        return 'status-accepted';
      case 'CHAUFFEUR_EN_ROUTE':
      case 'CHAUFFEUR_ARRIVE':
      case 'EN_COURS':
        return 'status-progress';
      case 'TERMINEE':
        return 'status-finished';
      default:
        return 'status-default';
    }
  }

  public trackByCourseId(_index: number, course: CourseResponseDTO): number {
    return Number(course?.id);
  }

  public getServiceLabel(category: unknown): string {
    switch (String(category || 'TOUS_SERVICES').toUpperCase()) {
      case 'TAXI_OFFICIEL': return this.texts[this.currentLang].serviceTaxi;
      case 'TRANSPORTEUR_TOURISTIQUE': return this.texts[this.currentLang].serviceTourist;
      case 'CHAUFFEUR_PRIVE': return this.texts[this.currentLang].servicePrivate;
      default: return this.texts[this.currentLang].serviceAll;
    }
  }

  public getPeriodLabel(period: unknown): string {
    return String(period || '').toUpperCase() === 'NUIT'
      ? this.texts[this.currentLang].nightPeriod
      : this.texts[this.currentLang].dayPeriod;
  }

  public formatScheduledDeparture(value: unknown): string {
    if (!value) return '—';
    const date = new Date(String(value));
    return Number.isNaN(date.getTime())
      ? String(value)
      : new Intl.DateTimeFormat(this.apiService.currentLanguage(), {
          dateStyle: 'short',
          timeStyle: 'short'
        }).format(date);
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

  private loadPassengerCourses(): void {
    this.apiService.getCurrentPassengerCourses()
      .pipe(finalize(() => this.finishLoading()))
      .subscribe({
        next: courses => {
          this.courses = this.toSafeArray(courses);
          this.coursesDisponibles = [];
          this.mesCourses = [];
          this.changeDetectorRef.markForCheck();
        },
        error: err =>
          this.handleLoadError(
            'Erreur chargement courses du passager connecté',
            err
          )
      });
  }

  private loadDriverCourses(): void {
    forkJoin({
      chauffeur: this.apiService.getCurrentChauffeur(),
      disponibles: this.apiService.getCoursesEnAttente(),
      affectees: this.apiService.getCurrentDriverCourses(),
      propositions: this.apiService.getCurrentDriverPropositions()
    })
      .pipe(finalize(() => this.finishLoading()))
      .subscribe({
        next: result => {
          this.chauffeur = result.chauffeur;
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
          this.handleLoadError('Erreur chargement courses du chauffeur connecté', err)
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

  private createEmptyPaymentForm(): PaymentForm {
    return { methode: 'CASH', cardName: '', cardNumber: '', expiry: '', cvc: '' };
  }

  private createEmptyProposalForm(): ProposalForm {
    return {
      prixPropose: null,
      distanceChauffeurDepart: null,
      tempsEstimeMinutes: null,
      message: ''
    };
  }

  private toSafeArray(data: unknown): CourseResponseDTO[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return [...data as CourseResponseDTO[]].sort((a, b) => {
      const dateA = Date.parse(a.dateCreation);
      const dateB = Date.parse(b.dateCreation);

      if (Number.isFinite(dateA) && Number.isFinite(dateB)
          && dateA !== dateB) {
        return dateB - dateA;
      }

      return Number(b.id) - Number(a.id);
    });
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
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

}
