import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  public labels: any = {
    fr: {
      overview: 'Vue d\'ensemble',
      drivers: 'Chauffeurs',
      passengers: 'Passagers',
      trips: 'Courses',
      payments: 'Paiements',
      emergency: 'SOS Urgence',
      profile: 'Mon profil',
      logout: 'Déconnexion'
    },

    en: {
      overview: 'Overview',
      drivers: 'Drivers',
      passengers: 'Passengers',
      trips: 'Trips',
      payments: 'Payments',
      emergency: 'Emergency SOS',
      profile: 'My Profile',
      logout: 'Logout'
    },

    ar: {
      overview: 'لوحة التحكم العامة',
      drivers: 'إدارة السائقين',
      passengers: 'إدارة الركاب',
      trips: 'الرحلات النشطة',
      payments: 'المدفوعات والمالية',
      emergency: 'SOS طوارئ',
      profile: 'ملفي الشخصي',
      logout: 'تسجيل الخروج'
    },

    es: {
      overview: 'Panel General',
      drivers: 'Conductores',
      passengers: 'Pasajeros',
      trips: 'Viajes',
      payments: 'Pagos',
      emergency: 'SOS Emergencia',
      profile: 'Mi perfil',
      logout: 'Cerrar sesión'
    }
  };

  constructor(
    public apiService: ApiService,
    private router: Router
  ) {}

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const lang = select.value as 'fr' | 'en' | 'ar' | 'es';
    this.apiService.setLanguage(lang);
  }

  get currentLang(): 'fr' | 'en' | 'ar' | 'es' {
    return this.apiService.currentLanguage();
  }

  get userRole(): string {
    return localStorage.getItem('userRole') || 'VISITEUR';
  }

  get userEmail(): string {
    return localStorage.getItem('userEmail') || 'Utilisateur DriveMe';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');

    this.router.navigate(['/login']);
  }
}
