import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="driveme-topbar" [attr.dir]="apiService.isRtlMode() ? 'rtl' : 'ltr'">
      <div class="topbar-left">
        <!-- Bouton Retour magique pour ne plus jamais être bloqué -->
        <button type="button" class="btn-navigation-back" (click)="reculer()">
          {{ apiService.currentLanguage() === 'ar' ? '← رجوع' : '← Retour' }}
        </button>
        <span class="topbar-brand" routerLink="/">DriveMe 2026</span>
      </div>

      <div class="topbar-right">
        <div class="user-profile-badge">
          <span class="user-avatar">👤</span>
          <span class="user-meta">Espace Connecté</span>
        </div>
        <button type="button" class="btn-logout-gate" (click)="quitter()">
          {{ apiService.currentLanguage() === 'ar' ? 'خروج' : 'Déconnexion' }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    .driveme-topbar { display: flex; justify-content: space-between; align-items: center; background-color: #ffffff; padding: 0.85rem 2rem; border-bottom: 1px solid #e2e8f0; font-family: 'Poppins', sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .topbar-left, .topbar-right { display: flex; align-items: center; gap: 1.5rem; }
    .btn-navigation-back { background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.45rem 0.9rem; border-radius: 0.375rem; font-weight: 700; cursor: pointer; color: #334155; font-size: 0.85rem; transition: background 0.15s; }
    .btn-navigation-back:hover { background-color: #e2e8f0; }
    .topbar-brand { font-size: 1.3rem; font-weight: 800; color: #00A86B; cursor: pointer; letter-spacing: -0.02em; }
    .user-profile-badge { display: flex; align-items: center; gap: 0.5rem; background-color: #f8fafc; padding: 0.35rem 0.75rem; border-radius: 20px; border: 1px solid #e2e8f0; }
    .user-avatar { font-size: 1rem; }
    .user-meta { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
    .btn-logout-gate { background: none; border: none; color: #ef4444; font-weight: 700; cursor: pointer; font-size: 0.9rem; }
  `]
})
export class TopbarComponent {
  constructor(public apiService: ApiService, private location: Location, private router: Router) {}

  public reculer(): void {
    this.location.back(); // Déclenche le retour arrière natif du navigateur !
  }

  public quitter(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
