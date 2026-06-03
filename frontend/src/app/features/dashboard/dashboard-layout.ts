import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Correction du chemin d'import : ../../ pour remonter de features et dashboard vers app/core
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrapper">
      <aside class="sidebar">
        <nav style="display: flex; flex-direction: column; gap: 15px;">
          <a routerLink="/dashboard/vue-ensemble" style="color: white; text-decoration: none;">Vue d'ensemble</a>
          <a routerLink="/dashboard/chauffeurs" style="color: white; text-decoration: none;">Gestion Chauffeurs</a>
          <a routerLink="/dashboard/courses" style="color: white; text-decoration: none;">Mes Courses</a>
        </nav>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { display: flex; height: 100vh; width: 100%; }
    .sidebar { width: 250px; background: #0f172a; color: white; padding: 20px; flex-shrink: 0; }
    .content { flex: 1; padding: 30px; background: #f8fafc; overflow-y: auto; }
  `]
})
export class DashboardLayoutComponent {
  public apiService = inject(ApiService);
}
