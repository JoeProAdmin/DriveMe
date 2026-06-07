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
      emergency: 'ALERTE URGENCE (SOS)',
      profile: 'Mon profil',
      logout: 'Déconnexion'
    },
    en: {
      overview: 'Overview Portal',
      drivers: 'Drivers Registry',
      passengers: 'Passengers Core',
      trips: 'Transit Tracks',
      payments: 'Financial Flows',
      emergency: 'PANIC ALERT (SOS)',
      profile: 'My Profile',
      logout: 'Logout'
    },
    ar: {
      overview: 'لوحة التحكم العامة',
      drivers: 'إدارة السائقين',
      passengers: 'إدارة الركاب',
      trips: 'الرحلات النشطة',
      payments: 'المدفوعات والمالية',
      emergency: 'إشارة طوارئ (SOS)',
      profile: 'ملفي الشخصي',
      logout: 'تسجيل الخروج'
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

  get currentLang(): string {
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
