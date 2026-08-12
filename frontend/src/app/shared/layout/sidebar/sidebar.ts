import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-unified-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class UnifiedSidebarComponent {
  constructor(public readonly apiService: ApiService) {}
  @Input() role = localStorage.getItem('userRole') || 'VISITEUR';
  @Input() email = localStorage.getItem('userEmail') || 'Utilisateur DriveMe';
  @Input() mobileOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  @HostBinding('class.is-mobile-open')
  get mobileOpenClass(): boolean {
    return this.mobileOpen;
  }

  get closeLabel(): string {
    const labels = {
      fr: 'Fermer le menu',
      en: 'Close menu',
      es: 'Cerrar el menú',
      ar: 'إغلاق القائمة',
    };
    return labels[this.apiService.currentLanguage()] || labels.fr;
  }
}
