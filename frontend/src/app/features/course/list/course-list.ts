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
  PassagerResponseDTO
} from '../../../core/api.service';

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
  public userRole = '';

  public currentLang: 'FR' | 'EN' | 'AR' | 'ES' = 'FR';

  public readonly texts = {
    FR: {
      title: 'Gestion des courses',
      subtitleAdmin: 'Supervision de toutes les courses DriveMe',
      subtitlePassenger: 'Suivi de vos demandes de course',
      subtitleDriver: 'Consultez les demandes disponibles et suivez vos courses',
      dash: 'Dashboard',
      refresh: 'Rafraîchir',
      total: 'Total',
      waiting: 'En attente',
      accepted: 'Acceptées',
      finished: 'Terminées',
      available: 'Disponibles',
      myTrips: 'Mes courses',
      availableTrips: 'Courses disponibles',
      loading: 'Chargement des courses...',
      errorLoad: 'Erreur lors du chargement des courses.',
      dep: 'Départ',
      dest: 'Destination',
      pass: 'Passager',
      drv: 'Chauffeur',
      price: 'Prix',
      status: 'Statut',
      propose: 'Faire une proposition',
      end: 'Terminer la course',
      t1: 'Demande envoyée',
      t2: 'Chauffeur sélectionné',
      t3: 'Course terminée',
      empty: 'Aucune course disponible.',
      emptyAvailable: 'Aucune nouvelle demande de course.',
      emptyDriverTrips: 'Aucune course ne vous est actuellement affectée.',
      waitingDriver: 'En attente d’un chauffeur'
    },
    EN: {
      title: 'Ride Management',
      subtitleAdmin: 'Supervision of all DriveMe rides',
      subtitlePassenger: 'Track your ride requests',
      subtitleDriver: 'View available requests and track your rides',
      dash: 'Dashboard',
      refresh: 'Refresh',
      total: 'Total',
      waiting: 'Pending',
      accepted: 'Accepted',
      finished: 'Finished',
      available: 'Available',
      myTrips: 'My rides',
      availableTrips: 'Available rides',
      loading: 'Loading rides...',
      errorLoad: 'Error loading rides.',
      dep: 'Departure',
      dest: 'Destination',
      pass: 'Passenger',
      drv: 'Driver',
      price: 'Price',
      status: 'Status',
      propose: 'Make an offer',
      end: 'Finish ride',
      t1: 'Request sent',
      t2: 'Driver selected',
      t3: 'Ride finished',
      empty: 'No rides available.',
      emptyAvailable: 'No new ride requests.',
      emptyDriverTrips: 'No ride is currently assigned to you.',
      waitingDriver: 'Waiting for a driver'
    },
    AR: {
      title: 'إدارة الرحلات',
      subtitleAdmin: 'الإشراف على جميع رحلات DriveMe',
      subtitlePassenger: 'تتبع طلبات الرحلات الخاصة بك',
      subtitleDriver: 'عرض الطلبات المتاحة وتتبع رحلاتك',
      dash: 'لوحة التحكم',
      refresh: 'تحديث',
      total: 'الإجمالي',
      waiting: 'قيد الانتظار',
      accepted: 'مقبولة',
      finished: 'مكتملة',
      available: 'متاحة',
      myTrips: 'رحلاتي',
      availableTrips: 'الرحلات المتاحة',
      loading: 'جاري تحميل الرحلات...',
      errorLoad: 'حدث خطأ أثناء تحميل الرحلات.',
      dep: 'نقطة الانطلاق',
      dest: 'الوجهة',
      pass: 'الراكب',
      drv: 'السائق',
      price: 'السعر',
      status: 'الحالة',
      propose: 'تقديم عرض',
      end: 'إنهاء الرحلة',
      t1: 'تم إرسال الطلب',
      t2: 'تم اختيار السائق',
      t3: 'اكتملت الرحلة',
      empty: 'لا توجد رحلات.',
      emptyAvailable: 'لا توجد طلبات رحلات جديدة.',
      emptyDriverTrips: 'لا توجد رحلة مسندة إليك حالياً.',
      waitingDriver: 'في انتظار سائق'
    },
    ES: {
      title: 'Gestión de viajes',
      subtitleAdmin: 'Supervisión de todos los viajes DriveMe',
      subtitlePassenger: 'Seguimiento de tus solicitudes de viaje',
      subtitleDriver: 'Consulta solicitudes disponibles y sigue tus viajes',
      dash: 'Dashboard',
      refresh: 'Refrescar',
      total: 'Total',
      waiting: 'Pendientes',
      accepted: 'Aceptados',
      finished: 'Finalizados',
      available: 'Disponibles',
      myTrips: 'Mis viajes',
      availableTrips: 'Viajes disponibles',
      loading: 'Cargando viajes...',
      errorLoad: 'Error al cargar los viajes.',
      dep: 'Salida',
      dest: 'Destino',
      pass: 'Pasajero',
      drv: 'Conductor',
      price: 'Precio',
      status: 'Estado',
      propose: 'Hacer una oferta',
      end: 'Finalizar viaje',
      t1: 'Solicitud enviada',
      t2: 'Conductor seleccionado',
      t3: 'Viaje finalizado',
      empty: 'No hay viajes disponibles.',
      emptyAvailable: 'No hay nuevas solicitudes de viaje.',
      emptyDriverTrips: 'No tienes ningún viaje asignado actualmente.',
      waitingDriver: 'Esperando conductor'
    }
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
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

  public loadCourses(showLoading: boolean = true): void {
    if (showLoading) {
      this.loading = true;
    }

    this.errorMessage = '';
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
        error: (err: any) => {
          console.error('Erreur fin de course', err);
          this.errorMessage =
            err?.error?.message ||
            this.texts[this.currentLang].errorLoad;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public openProposal(course: any): void {
    console.log('Course sélectionnée pour proposition :', course);
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

  private loadAdminCourses(): void {
    this.apiService.getCourses()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: (data: any[]) => {
          this.courses = this.toSafeArray(data);
          this.coursesDisponibles = [];
          this.mesCourses = [];
          console.log('ADMIN - courses reçues :', this.courses);
          this.changeDetectorRef.markForCheck();
        },
        error: (err: any) => {
          this.handleLoadError('Erreur chargement courses admin', err);
        }
      });
  }

  private loadPassengerCourses(email: string): void {
    if (!email) {
      this.handleMissingIdentity();
      return;
    }

    this.apiService.getPassagerByEmail(email).subscribe({
      next: (passager: PassagerResponseDTO) => {
        this.passager = passager;

        this.apiService.getCoursesByPassager(passager.id)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.changeDetectorRef.markForCheck();
            })
          )
          .subscribe({
            next: (data: any[]) => {
              this.courses = this.toSafeArray(data);
              this.coursesDisponibles = [];
              this.mesCourses = [];
              console.log('PASSAGER - courses reçues :', this.courses);
              this.changeDetectorRef.markForCheck();
            },
            error: (err: any) => {
              this.handleLoadError('Erreur chargement courses passager', err);
            }
          });
      },
      error: (err: any) => {
        this.handleLoadError('Erreur récupération passager connecté', err);
      }
    });
  }

  private loadDriverCourses(email: string): void {
    if (!email) {
      this.handleMissingIdentity();
      return;
    }

    this.apiService.getChauffeurByEmail(email).subscribe({
      next: (chauffeur: ChauffeurResponseDTO) => {
        this.chauffeur = chauffeur;

        forkJoin({
          disponibles: this.apiService.getCoursesEnAttente(),
          affectees: this.apiService.getCoursesByChauffeur(chauffeur.id)
        })
          .pipe(
            finalize(() => {
              this.loading = false;
              this.changeDetectorRef.markForCheck();
            })
          )
          .subscribe({
            next: result => {
              this.courses = [];
              this.coursesDisponibles = this.toSafeArray(result.disponibles);
              this.mesCourses = this.toSafeArray(result.affectees);

              console.log(
                'CHAUFFEUR - courses disponibles :',
                this.coursesDisponibles
              );
              console.log(
                'CHAUFFEUR - mes courses :',
                this.mesCourses
              );

              this.changeDetectorRef.markForCheck();
            },
            error: (err: any) => {
              this.handleLoadError('Erreur chargement courses chauffeur', err);
            }
          });
      },
      error: (err: any) => {
        this.handleLoadError('Erreur récupération chauffeur connecté', err);
      }
    });
  }

  private handleLoadError(message: string, err: any): void {
    console.error(message, err);

    this.courses = [];
    this.coursesDisponibles = [];
    this.mesCourses = [];
    this.loading = false;
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

  private toSafeArray(data: unknown): any[] {
    return Array.isArray(data) ? data : [];
  }

  private normalizeStatus(status: unknown): string {
    return String(status ?? '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
