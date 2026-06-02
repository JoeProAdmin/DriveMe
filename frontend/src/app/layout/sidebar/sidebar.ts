import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  // Centralisation des libellés commerciaux pour la démonstration multilingue
  public labels: any = {
    fr: {
      overview: 'Vue d\'ensemble',
      drivers: 'Chauffeurs',
      passengers: 'Passagers',
      trips: 'Courses',
      payments: 'Paiements',
      emergency: 'ALERTE URGENCE (SOS)'
    },
    en: {
      overview: 'Overview Portal',
      drivers: 'Drivers Registry',
      passengers: 'Passengers Core',
      trips: 'Transit Tracks',
      payments: 'Financial Flows',
      emergency: 'PANIC ALERT (SOS)'
    },
    ar: {
      overview: 'لوحة التحكم العامة',
      drivers: 'إدارة السائقين',
      passengers: 'إدارة الركاب',
      trips: 'الرحلات النشطة',
      payments: 'المدفوعات والمالية',
      emergency: 'إشارة طوارئ (SOS)'
    }
  };

  constructor(public apiService: ApiService) {}

  /**
   * Capture le changement de sélecteur linguistique et mute l'écosystème global
   */
  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const lang = select.value as 'fr' | 'en' | 'ar' | 'es';
    this.apiService.setLanguage(lang);
  }
}
