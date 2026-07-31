import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header';
import { UnifiedSidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, UnifiedSidebarComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss'
})
export class AppLayoutComponent {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  readonly userRole = localStorage.getItem('userRole') || 'VISITEUR';
  readonly userEmail = localStorage.getItem('userEmail') || 'Utilisateur DriveMe';

  get currentLang(): 'FR' | 'EN' | 'AR' | 'ES' {
    return this.api.currentLanguage().toUpperCase() as 'FR' | 'EN' | 'AR' | 'ES';
  }

  changeLanguage(language: string): void {
    this.api.setLanguage(language.toLowerCase() as 'fr' | 'en' | 'ar' | 'es');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    void this.router.navigate(['/login']);
  }
}
