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

    <div class="card money-card">
      <span class="label">{{ texts[currentLang].paidVolume }}</span>
      <p>{{ stats.montantPaiementsPayes | number:'1.2-2' }} MAD</p>
      <small>{{ stats.paiementsPayes }} {{ texts[currentLang].paidPayments }}</small>
    </div>

    <div class="card money-card">
      <span class="label">{{ texts[currentLang].driverCredits }}</span>
      <p>{{ stats.soldeCreditsChauffeurs | number:'1.2-2' }} MAD</p>
      <small>{{ texts[currentLang].driverCreditsHint }}</small>
    </div>

    <div class="card money-card">
      <span class="label">{{ texts[currentLang].commissions }}</span>
      <p>{{ stats.commissionsDriveMe | number:'1.2-2' }} MAD</p>
      <small>10 % des courses terminées</small>
    </div>

    <div class="card money-card">
      <span class="label">{{ texts[currentLang].topups }}</span>
      <p>{{ stats.rechargesValidees | number:'1.2-2' }} MAD</p>
      <small>{{ stats.rechargesEnAttente }} {{ texts[currentLang].pendingTopups }}</small>
    </div>

  </div>

  <div class="stats-grid" *ngIf="courseStatsLoaded"
       [attr.dir]="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="card">
      <span class="label">{{ texts[currentLang].waitingTrips }}</span>
      <p>{{ stats.coursesEnAttente }}</p>
    </div>
    <div class="card">
      <span class="label">{{ texts[currentLang].activeTrips }}</span>
      <p>{{ stats.coursesActives }}</p>
    </div>
    <div class="card">
      <span class="label">{{ texts[currentLang].finishedTrips }}</span>
      <p>{{ stats.coursesTerminees }}</p>
    </div>
    <div class="card">
      <span class="label">{{ texts[currentLang].cancelledTrips }}</span>
      <p>{{ stats.coursesAnnulees }}</p>
    </div>
  </div>
  <p *ngIf="courseStatsError" role="alert">
    {{ texts[currentLang].statsUnavailable }}
  </p>

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

    .money-card p{
      font-size:30px;
    }

    .money-card small{
      display:block;
      margin-top:8px;
      color:#64748b;
      font-size:12px;
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

    @media (max-width:700px){
      .admin-dashboard{
        padding:14px;
      }

      .dashboard-header{
        margin-bottom:18px;
      }

      .dashboard-header h1{
        font-size:clamp(1.8rem,8vw,2.2rem);
        line-height:1.08;
      }

      .dashboard-header p{
        margin-top:6px;
        font-size:.98rem;
        line-height:1.4;
      }

      .stats-grid{
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:10px;
        margin-bottom:18px;
      }

      .card{
        min-height:112px;
        padding:14px;
      }

      .label{
        min-height:2.5em;
        line-height:1.25;
      }

      .card p,
      .money-card p{
        margin:8px 0 0;
        font-size:clamp(1.45rem,6.5vw,1.85rem);
        line-height:1.15;
        overflow-wrap:anywhere;
      }

      .money-card small{
        margin-top:5px;
        font-size:10px;
        line-height:1.25;
      }

      .quick-actions{
        grid-template-columns:1fr;
        gap:10px;
      }

      .action-card{
        padding:16px;
      }
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

  public courseStatsLoaded = false;
  public courseStatsError = false;

  public stats: AdminStats = {
    totalChauffeurs: 0,
    totalPassagers: 0,
    totalCourses: 0,
    totalPaiements: 0,
    paiementsPayes: 0,
    montantPaiementsPayes: 0,
    soldeCreditsChauffeurs: 0,
    commissionsDriveMe: 0,
    rechargesValidees: 0,
    rechargesEnAttente: 0
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
      waitingTrips: 'EN ATTENTE',
      activeTrips: 'ACTIVES',
      finishedTrips: 'TERMINÉES',
      cancelledTrips: 'ANNULÉES',
      statsUnavailable: 'Répartition des courses indisponible. Actualisez la page.',
      payments: 'PAIEMENTS',
      paidVolume: 'VOLUME DES COURSES PAYÉES',
      paidPayments: 'paiement(s) payé(s)',
      driverCredits: 'CRÉDITS CHAUFFEURS',
      driverCreditsHint: 'Solde total disponible sur les comptes chauffeurs',
      commissions: 'COMMISSIONS DRIVEME', topups: 'RECHARGES VALIDÉES', pendingTopups: 'recharge(s) en attente',
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
      waitingTrips: 'PENDING',
      activeTrips: 'ACTIVE',
      finishedTrips: 'COMPLETED',
      cancelledTrips: 'CANCELLED',
      statsUnavailable: 'Trip breakdown unavailable. Refresh the page.',
      payments: 'PAYMENTS',
      paidVolume: 'PAID TRIP VOLUME',
      paidPayments: 'paid payment(s)',
      driverCredits: 'DRIVER CREDITS',
      driverCreditsHint: 'Total balance available on driver accounts',
      commissions: 'DRIVEME COMMISSIONS', topups: 'VALIDATED TOP-UPS', pendingTopups: 'pending top-up(s)',
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
      waitingTrips: 'قيد الانتظار',
      activeTrips: 'نشطة',
      finishedTrips: 'مكتملة',
      cancelledTrips: 'ملغاة',
      statsUnavailable: 'توزيع الرحلات غير متاح. يرجى تحديث الصفحة.',
      payments: 'المدفوعات',
      paidVolume: 'حجم الرحلات المدفوعة',
      paidPayments: 'دفعة مدفوعة',
      driverCredits: 'رصيد السائقين',
      driverCreditsHint: 'إجمالي الرصيد المتاح في حسابات السائقين',
      commissions: 'عمولات DriveMe', topups: 'عمليات الشحن المعتمدة', pendingTopups: 'عملية شحن قيد الانتظار',
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
      waitingTrips: 'PENDIENTES',
      activeTrips: 'ACTIVOS',
      finishedTrips: 'FINALIZADOS',
      cancelledTrips: 'CANCELADOS',
      statsUnavailable: 'Desglose de viajes no disponible. Actualice la página.',
      payments: 'PAGOS',
      paidVolume: 'VOLUMEN DE VIAJES PAGADOS',
      paidPayments: 'pago(s) pagado(s)',
      driverCredits: 'CRÉDITOS DE CONDUCTORES',
      driverCreditsHint: 'Saldo total disponible en las cuentas de conductores',
      commissions: 'COMISIONES DRIVEME', topups: 'RECARGAS VALIDADAS', pendingTopups: 'recarga(s) pendiente(s)',
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

        const counts = [data.coursesEnAttente, data.coursesActives,
          data.coursesTerminees, data.coursesAnnulees];
        const valid = counts.every(value =>
          typeof value === 'number' && Number.isSafeInteger(value) && value >= 0)
          && typeof data.totalCourses === 'number'
          && Number.isSafeInteger(data.totalCourses)
          && data.totalCourses >= 0
          && counts.reduce<number>((sum, value) => sum + (value ?? 0), 0)
            === data.totalCourses;

        this.courseStatsLoaded = valid;
        this.courseStatsError = !valid;
        if (valid) {
          this.stats.coursesEnAttente = data.coursesEnAttente;
          this.stats.coursesActives = data.coursesActives;
          this.stats.coursesTerminees = data.coursesTerminees;
          this.stats.coursesAnnulees = data.coursesAnnulees;
        }
        this.stats.totalPaiements = Number(data?.totalPaiements ?? 0);
        this.stats.paiementsPayes = Number(data?.paiementsPayes ?? 0);
        this.stats.montantPaiementsPayes = Number(data?.montantPaiementsPayes ?? 0);
        this.stats.soldeCreditsChauffeurs = Number(data?.soldeCreditsChauffeurs ?? 0);
        this.stats.commissionsDriveMe = Number(data?.commissionsDriveMe ?? 0);
        this.stats.rechargesValidees = Number(data?.rechargesValidees ?? 0);
        this.stats.rechargesEnAttente = Number(data?.rechargesEnAttente ?? 0);

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement statistiques administrateur', err);

        this.courseStatsLoaded = false;
        this.courseStatsError = true;
        this.stats.totalChauffeurs = 0;
        this.stats.totalPassagers = 0;
        this.stats.totalCourses = 0;
        this.stats.totalPaiements = 0;
        this.stats.paiementsPayes = 0;
        this.stats.montantPaiementsPayes = 0;
        this.stats.soldeCreditsChauffeurs = 0;
        this.stats.commissionsDriveMe = 0;
        this.stats.rechargesValidees = 0;
        this.stats.rechargesEnAttente = 0;

        this.cdr.detectChanges();
      }
    });
  }
}
