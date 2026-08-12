import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  constructor(public readonly apiService: ApiService) {}
  @Input() mode: 'public' | 'auth' | 'app' = 'public';
  @Input() currentLang = 'FR';
  @Input() userLabel = '';
  @Input() menuOpen = false;
  @Output() languageChange = new EventEmitter<string>();
  @Output() menuToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  get menuLabel(): string {
    const labels: Record<string, string> = {
      FR: this.menuOpen ? 'Fermer le menu' : 'Ouvrir le menu',
      EN: this.menuOpen ? 'Close menu' : 'Open menu',
      ES: this.menuOpen ? 'Cerrar el menú' : 'Abrir el menú',
      AR: this.menuOpen ? 'إغلاق القائمة' : 'فتح القائمة',
    };
    return labels[this.currentLang] || labels['FR'];
  }
}
