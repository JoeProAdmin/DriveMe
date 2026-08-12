import { Component, HostListener, OnDestroy, Renderer2, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header';
import { UnifiedSidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, UnifiedSidebarComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayoutComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly renderer = inject(Renderer2);

  mobileMenuOpen = false;

  readonly userRole = localStorage.getItem('userRole') || 'VISITEUR';
  readonly userEmail = localStorage.getItem('userEmail') || 'Utilisateur DriveMe';

  get currentLang(): 'FR' | 'EN' | 'AR' | 'ES' {
    return this.api.currentLanguage().toUpperCase() as 'FR' | 'EN' | 'AR' | 'ES';
  }

  changeLanguage(language: string): void {
    this.api.setLanguage(language.toLowerCase() as 'fr' | 'en' | 'ar' | 'es');
  }

  toggleMobileMenu(): void {
    this.setMobileMenuState(!this.mobileMenuOpen);
  }

  closeMobileMenu(): void {
    this.setMobileMenuState(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 900) {
      this.closeMobileMenu();
    }
  }

  logout(): void {
    this.closeMobileMenu();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    void this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  private setMobileMenuState(open: boolean): void {
    this.mobileMenuOpen = open;
    if (open) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }
}
