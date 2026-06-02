import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  currentLang: 'fr' | 'en' | 'ar' | 'es' = 'fr';
  isRtl: boolean = false;
  currentCurrency: string = '€'; // Devise par défaut pour le français

  labels: any = {
    fr: {
      overview: 'Vue d\'ensemble',
      drivers: 'Chauffeurs',
      passengers: 'Passagers',
      trips: 'Courses',
      payments: 'Paiements',
      systemStatus: 'Système opérationnel',
      dashboardTitle: 'Tableau de bord DriveMe',
      kpiDrivers: 'Conducteurs Connectés',
      kpiPassengers: 'Clients Passagers',
      kpiTrips: 'Trajets Traités',
      kpiVolume: 'Volume de Transaction'
    },
    en: {
      overview: 'Overview Portal',
      drivers: 'Drivers Registry',
      passengers: 'Passengers Core',
      trips: 'Transit Tracks',
      payments: 'Financial Flows',
      systemStatus: 'System Operational',
      dashboardTitle: 'DriveMe Control Center',
      kpiDrivers: 'Connected Drivers',
      kpiPassengers: 'Passenger Accounts',
      kpiTrips: 'Processed Trips',
      kpiVolume: 'Transaction Volume'
    },
    ar: {
      overview: 'لوحة التحكم العامة',
      drivers: 'إدارة السائقين',
      passengers: 'إدارة الركاب',
      trips: 'الرحلات النشطة',
      payments: 'المدفوعات والمالية',
      systemStatus: 'النظام يعمل بنجاح',
      dashboardTitle: 'لوحة قيادة درايف مي',
      kpiDrivers: 'السائقون المتصلون',
      kpiPassengers: 'حسابات الركاب',
      kpiTrips: 'الرحلات المعالجة',
      kpiVolume: 'حجم المعاملات المالية'
    },
    es: {
      overview: 'Vista General',
      drivers: 'Conductores',
      passengers: 'Pasajeros',
      trips: 'Viajes',
      payments: 'Pagos',
      systemStatus: 'Sistema Operativo',
      dashboardTitle: 'Panel de Control DriveMe',
      kpiDrivers: 'Conductores Conectados',
      kpiPassengers: 'Clientes Pasajeros',
      kpiTrips: 'Viajes Procesados',
      kpiVolume: 'Volumen de Transacciones'
    }
  };

  stats: any = {
    totalChauffeurs: 0,
    totalPassagers: 0,
    totalCourses: 0,
    totalPaiements: 0,
    totalAvis: 0
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.api.getAdminStats().subscribe({
      next: (data) => {
        console.log('API Analytics Data Loaded:', data);
        this.stats = data;
      },
      error: (err) => {
        console.error('API Fail Safe Interceptor:', err);
      }
    });
  }

  switchLanguage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const targetLang = selectElement.value as 'fr' | 'en' | 'ar' | 'es';

    this.currentLang = targetLang;
    this.isRtl = (targetLang === 'ar');

    // Architecture de conversion de la devise de présentation
    if (targetLang === 'ar') {
      this.currentCurrency = 'MAD';
    } else if (targetLang === 'en') {
      this.currentCurrency = '$';
    } else {
      this.currentCurrency = '€';
    }

    console.log(`Language: ${targetLang.toUpperCase()} | RTL: ${this.isRtl} | Currency Scope: ${this.currentCurrency}`);
  }
}
