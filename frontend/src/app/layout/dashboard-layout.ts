import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../core/api.service'; // <--- CORRIGÉ ICI

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrapper">
      <aside class="sidebar">
        <nav class="nav-links">
          <a routerLink="/dashboard/chauffeurs">Gestion Chauffeurs</a>
          <a routerLink="/dashboard/create-course">Créer une course</a>
        </nav>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { display: flex; height: 100vh; width: 100%; }
    .sidebar { width: 250px; background: #0f172a; color: white; padding: 20px; }
    .nav-links { display: flex; flex-direction: column; gap: 15px; }
    .nav-links a { color: white; text-decoration: none; }
    .content { flex: 1; padding: 30px; background: #f8fafc; }
  `]
})
export class DashboardLayoutComponent {
  public apiService = inject(ApiService);
}
