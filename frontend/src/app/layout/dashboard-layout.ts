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

      <main class="content">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    .dashboard-wrapper{
      width:100%;
      min-height:100vh;
    }

    .content{
      width:100%;
      min-height:100vh;
      background:#f8fafc;
    }
  `]
})
export class DashboardLayoutComponent {
  public apiService = inject(ApiService);
}
