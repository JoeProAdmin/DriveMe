import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, AdminStats } from '../../../core/api.service';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

<div class="admin-dashboard">

  <div class="dashboard-header">

    <div>
      <h1>{{ texts[currentLang].title }}</h1>
      <p>{{ texts[currentLang].subtitle }}</p>
    </div>

  </div>

  <div class="stats-grid">

    <div class="card">
      <span class="label">{{ texts[currentLang].drivers }}</span>
      <p>{{ stats.totalChauffeurs }}</p>
    </div>

    <div class="card">
      <span class="label">{{ texts[currentLang].passengers }}</span>
      <p>{{ stats.totalPassagers }}</p>
    </div>

    <div class="card">
      <span class="label">{{ texts[currentLang].trips }}</span>
      <p>{{ stats.totalCourses }}</p>
    </div>

    <div class="card">
      <span class="label">{{ texts[currentLang].payments }}</span>
      <p>{{ stats.totalPaiements }}</p>
    </div>

  </div>

  <div class="quick-actions">

    <a class="action-card" routerLink="/chauffeurs">
      <h3>{{ texts[currentLang].driverManagement }}</h3>
      <p>{{ texts[currentLang].driverDescription }}</p>
    </a>

    <a class="action-card" routerLink="/passagers">
      <h3>{{ texts[currentLang].passengerManagement }}</h3>
      <p>{{ texts[currentLang].passengerDescription }}</p>
    </a>

    <a class="action-card" routerLink="/courses">
      <h3>{{ texts[currentLang].tripManagement }}</h3>
      <p>{{ texts[currentLang].tripDescription }}</p>
    </a>

    <a class="action-card" routerLink="/paiements">
      <h3>{{ texts[currentLang].paymentManagement }}</h3>
      <p>{{ texts[currentLang].paymentDescription }}</p>
    </a>

  </div>

</div>

`,
  styles: [`

    .admin-dashboard{
      padding:30px;
    }

    .dashboard-header{
      margin-bottom:30px;
    }

    .dashboard-header h1{
      margin:0;
      font-size:32px;
      font-weight:700;
      color:#0f172a;
    }

    .dashboard-header p{
      margin-top:10px;
      color:#64748b;
    }

    .stats-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:20px;
      margin-bottom:30px;
    }

    .card{
      background:white;
      border-radius:14px;
      padding:24px;
      border:1px solid #e5e7eb;
    }

    .label{
      display:block;
      font-size:12px;
      font-weight:700;
      color:#64748b;
    }

    .card p{
      margin-top:15px;
      font-size:36px;
      font-weight:700;
      color:#00C853;
    }

    .quick-actions{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
      gap:20px;
    }

    .action-card{
      display:block;
      text-decoration:none;
      color:inherit;
      cursor:pointer;
      transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
      background:white;
      border-radius:14px;
      padding:20px;
      border:1px solid #e5e7eb;
    }

    .action-card:hover{
      transform:translateY(-2px);
      border-color:#cbd5e1;
      box-shadow:0 8px 20px rgba(15,23,42,.08);
    }

  `]
})
export class AdminViewComponent implements OnInit {

  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  public stats: AdminStats = {
    totalChauffeurs: 0,
    totalPassagers: 0,
    totalCourses: 0,
    totalPaiements: 0
  };

  get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.api.currentLanguage();
  }

  public texts: any = {

    fr: {
      title: 'Centre de pilotage DriveMe',
      subtitle: 'Supervision des chauffeurs, passagers, courses et paiements.',
      drivers: 'CHAUFFEURS',
      passengers: 'PASSAGERS',
      trips: 'COURSES',
      payments: 'PAIEMENTS',
      driverManagement: 'Gestion Chauffeurs',
      driverDescription: 'Validation et suivi des chauffeurs inscrits.',
      passengerManagement: 'Gestion Passagers',
      passengerDescription: 'Consultation des comptes passagers.',
      tripManagement: 'Suivi des Courses',
      tripDescription: 'Contrôle des trajets en cours et terminés.',
      paymentManagement: 'Paiements',
      paymentDescription: 'Vérification des transactions DriveMe.'
    },

    en: {
      title: 'DriveMe Control Center',
      subtitle: 'Drivers, passengers, trips and payments supervision.',
      drivers: 'DRIVERS',
      passengers: 'PASSENGERS',
      trips: 'TRIPS',
      payments: 'PAYMENTS',
      driverManagement: 'Driver Management',
      driverDescription: 'Validation and monitoring of drivers.',
      passengerManagement: 'Passenger Management',
      passengerDescription: 'Passenger account supervision.',
      tripManagement: 'Trip Management',
      tripDescription: 'Control active and completed trips.',
      paymentManagement: 'Payments',
      paymentDescription: 'Monitor financial transactions.'
    },

    ar: {
      title: 'مركز إدارة DriveMe',
      subtitle: 'إدارة السائقين والركاب والرحلات والمدفوعات.',
      drivers: 'السائقون',
      passengers: 'الركاب',
      trips: 'الرحلات',
      payments: 'المدفوعات',
      driverManagement: 'إدارة السائقين',
      driverDescription: 'متابعة واعتماد السائقين.',
      passengerManagement: 'إدارة الركاب',
      passengerDescription: 'إدارة حسابات الركاب.',
      tripManagement: 'إدارة الرحلات',
      tripDescription: 'متابعة الرحلات الجارية والمنتهية.',
      paymentManagement: 'المدفوعات',
      paymentDescription: 'متابعة المعاملات المالية.'
    },

    es: {
      title: 'Centro de Control DriveMe',
      subtitle: 'Supervisión de conductores, pasajeros, viajes y pagos.',
      drivers: 'CONDUCTORES',
      passengers: 'PASAJEROS',
      trips: 'VIAJES',
      payments: 'PAGOS',
      driverManagement: 'Gestión Conductores',
      driverDescription: 'Validación y seguimiento.',
      passengerManagement: 'Gestión Pasajeros',
      passengerDescription: 'Administración de cuentas.',
      tripManagement: 'Gestión Viajes',
      tripDescription: 'Control de viajes activos.',
      paymentManagement: 'Pagos',
      paymentDescription: 'Seguimiento financiero.'
    }
  };

  ngOnInit(): void {
    this.loadAdminStats();
  }

  private loadAdminStats(): void {
    this.api.getAdminStats().subscribe({
      next: (data: AdminStats) => {
        this.stats.totalChauffeurs = Number(data?.totalChauffeurs ?? 0);
        this.stats.totalPassagers = Number(data?.totalPassagers ?? 0);
        this.stats.totalCourses = Number(data?.totalCourses ?? 0);
        this.stats.totalPaiements = Number(data?.totalPaiements ?? 0);

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement statistiques administrateur', err);

        this.stats.totalChauffeurs = 0;
        this.stats.totalPassagers = 0;
        this.stats.totalCourses = 0;
        this.stats.totalPaiements = 0;

        this.cdr.detectChanges();
      }
    });
  }
}
