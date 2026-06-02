import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, AdminStats } from '../../core/api.service';
import { SidebarComponent } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  public labels: any = {
    fr: {
      title: 'Tableau de bord d\'exploitation',
      subtitle: 'Analyse des flux transactionnels, monitoring de la conformité et télémétrie du réseau.',
      status: 'Système opérationnel',
      sync: 'Flux synchronisé en direct',
      kpiDrivers: 'Chauffeurs Connectés',
      kpiPassengers: 'Clients Passagers',
      kpiTrips: 'Trajets Traités',
      kpiVolume: 'Volume de Transactions',
      subDrivers: 'Dossiers administratifs certifiés',
      subPassengers: 'Comptes uniques vérifiés',
      subTrips: 'Workflow d\'états complets',
      subVolume: 'Passerelles locales et internationales',
      logTitle: 'Journal d\'activité réseau',
      actionsTitle: 'Raccourcis d\'administration',
      actionCourses: 'Gérer le registre des courses',
      actionChauffeurs: 'Contrôler la flotte de chauffeurs',
      specTitle: 'Architecture de Validation QR Code',
      specDesc: 'Composant d\'infrastructure prêt pour la signature cryptographique des QR Codes Chauffeurs et Reçus de paiement.'
    },
    en: {
      title: 'Operations Dashboard',
      subtitle: 'Analysis of transactional flows, compliance monitoring, and network telemetry.',
      status: 'System Operational',
      sync: 'Synchronous live feed',
      kpiDrivers: 'Active Drivers',
      kpiPassengers: 'Registered Passengers',
      kpiTrips: 'Processed Trips',
      kpiVolume: 'Transaction Volume',
      subDrivers: 'Certified administrative files',
      subPassengers: 'Verified unique accounts',
      subTrips: 'Full automated state workflow',
      subVolume: 'Local gateways & worldwide credit cards',
      logTitle: 'Network activity log',
      actionsTitle: 'Administrative shortcuts',
      actionCourses: 'Manage trip registry',
      actionChauffeurs: 'Control driver fleet',
      specTitle: 'QR Code Verification Framework',
      specDesc: 'Infrastructure module prepared for cryptographic signature tracking of Driver QR profiles and transaction receipts.'
    },
    ar: {
      title: 'لوحة القيادة والتشغيل',
      subtitle: 'تحليل التدفقات المالية، مراقبة الامتثال الإداري، وتتبع شبكة النقل المباشرة.',
      status: 'النظام يعمل بنجاح',
      sync: 'تحديث فوري متزامن',
      kpiDrivers: 'السائقون المتصلون',
      kpiPassengers: 'حسابات الركاب',
      kpiTrips: 'الرحلات المعالجة',
      kpiVolume: 'حجم المعاملات',
      subDrivers: 'الملفات الإدارية المعتمدة',
      subPassengers: 'الحسابات الفريدة المفعلة',
      subTrips: 'دورة حياة الرحلات الكاملة',
      subVolume: 'البوابات المحلية والبطاقات الدولية',
      logTitle: 'سجل نشاط الشبكة المباشر',
      actionsTitle: 'اختصارات الإدارة الصارمة',
      actionCourses: 'إدارة سجل الرحلات العام',
      actionChauffeurs: 'مراقبة أسطول السائقين',
      specTitle: 'بنية التحقق عبر رمز QR',
      specDesc: 'وحدة برمجية جاهزة للتكامل مع التوقيع الرقمي لرموز الـ QR الخاصة بالسائقين وإيصالات الدفع المشفرة.'
    }
  };

  public stats: AdminStats = {
    totalChauffeurs: 0,
    totalPassagers: 0,
    totalCourses: 0,
    totalPaiements: 0
  };

  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  private fetchAnalytics(): void {
    this.apiService.getAdminStats().subscribe({
      next: (data: AdminStats) => {
        console.log('DATA ANALYTICS LOADED:', data);
        this.stats = data;
      },
      error: (err: any) => {
        console.error('API GATEWAY INTERCEPTOR ERROR:', err);
      }
    });
  }
}
