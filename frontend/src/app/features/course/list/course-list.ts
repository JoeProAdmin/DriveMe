import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css']
})
export class CourseList implements OnInit, OnDestroy {

  courses: any[] = [];
  loading = false;
  errorMessage = '';
  userRole = '';

  public currentLang: 'FR' | 'EN' | 'AR' | 'ES' = 'FR';
  public texts = {
    FR: { title: 'Gestion des courses', subtitle: 'Suivi des courses DriveMe', dash: 'Dashboard', refresh: 'Rafraîchir', total: 'Total', waiting: 'En attente', accepted: 'Acceptées', finished: 'Terminées', loading: 'Chargement des courses...', errorLoad: 'Erreur chargement', dep: 'Départ', dest: 'Destination', pass: 'Passager', drv: 'Chauffeur', price: 'Prix', acc: 'Accepter la course', end: 'Terminer la course', t1: 'Demande envoyée', t2: 'Chauffeur accepté', t3: 'Course terminée', empty: 'Aucune course disponible.' },
    EN: { title: 'Ride Management', subtitle: 'DriveMe ride tracking', dash: 'Dashboard', refresh: 'Refresh', total: 'Total', waiting: 'Pending', accepted: 'Accepted', finished: 'Finished', loading: 'Loading rides...', errorLoad: 'Error loading', dep: 'Departure', dest: 'Destination', pass: 'Passenger', drv: 'Driver', price: 'Price', acc: 'Accept ride', end: 'Finish ride', t1: 'Request sent', t2: 'Driver accepted', t3: 'Ride finished', empty: 'No rides available.' },
    AR: { title: 'إدارة الرحلات', subtitle: 'تتبع رحلات DriveMe', dash: 'لوحة التحكم', refresh: 'تحديث', total: 'الإجمالي', waiting: 'قيد الانتظار', accepted: 'تم قبولها', finished: 'مكتملة', loading: 'جاري تحميل الرحلات...', errorLoad: 'خطأ في التحميل', dep: 'نقطة الانطلاق', dest: 'الوجهة', pass: 'الراكب', drv: 'السائق', price: 'السعر', acc: 'قبول الرحلة', end: 'إنهاء الرحلة', t1: 'تم إرسال الطلب', t2: 'تم قبول السائق', t3: 'اكتملت الرحلة', empty: 'لا توجد رحلات متاحة.' },
    ES: { title: 'Gestión de viajes', subtitle: 'Seguimiento de viajes DriveMe', dash: 'Dashboard', refresh: 'Refrescar', total: 'Total', waiting: 'Pendiente', accepted: 'Aceptado', finished: 'Finalizado', loading: 'Cargando viajes...', errorLoad: 'Error de carga', dep: 'Salida', dest: 'Destino', pass: 'Pasajero', drv: 'Conductor', price: 'Precio', acc: 'Aceptar viaje', end: 'Terminar viaje', t1: 'Solicitud enviada', t2: 'Conductor aceptado', t3: 'Viaje terminado', empty: 'No hay viajes disponibles.' }
  };

  private refreshSubscription?: Subscription;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.loadCourses();
    this.refreshSubscription = interval(5000).subscribe(() => this.loadCourses(false));
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadCourses(showLoading: boolean = true): void {
    if (showLoading) this.loading = true;
    this.errorMessage = '';
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    if (role === 'ADMIN') { this.loadAdminCourses(); return; }
    if (role === 'PASSAGER' && email) { this.loadPassengerCourses(email); return; }
    if (role === 'CHAUFFEUR' && email) { this.loadDriverCourses(); return; }
    this.courses = [];
    this.loading = false;
  }

  private loadAdminCourses(): void {
    this.apiService.getCourses().subscribe({
      next: (data: any[]) => { this.courses = data; this.loading = false; },
      error: () => { this.errorMessage = this.texts[this.currentLang].errorLoad; this.loading = false; }
    });
  }

  private loadPassengerCourses(email: string): void {
    this.apiService.getAllPassagers().subscribe({
      next: (passagers: any[]) => {
        const passager = passagers.find((p: any) => p.email === email);
        if (!passager) { this.courses = []; this.loading = false; return; }
        this.apiService.getCoursesByPassager(passager.id).subscribe({
          next: (data: any[]) => { this.courses = data; this.loading = false; },
          error: () => { this.errorMessage = this.texts[this.currentLang].errorLoad; this.loading = false; }
        });
      }
    });
  }

  private loadDriverCourses(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) { this.courses = []; this.loading = false; return; }
    this.apiService.getChauffeurByEmail(email).subscribe({
      next: (chauffeur) => {
        this.apiService.getCoursesByChauffeur(chauffeur.id).subscribe({
          next: (data: any[]) => { this.courses = data; this.loading = false; },
          error: () => { this.errorMessage = this.texts[this.currentLang].errorLoad; this.loading = false; }
        });
      }
    });
  }

  acceptCourse(courseId: number): void {
    this.apiService.updateCourseStatus(courseId, 'ACCEPTEE').subscribe(() => this.loadCourses(true));
  }

  finishCourse(courseId: number): void {
    this.apiService.updateCourseStatus(courseId, 'TERMINEE').subscribe(() => this.loadCourses(true));
  }

  goToDashboard(): void { this.router.navigate(['/dashboard']); }
}
