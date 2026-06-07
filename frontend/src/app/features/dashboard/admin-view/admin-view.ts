import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, AdminStats } from '../../../core/api.service';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">

      <h2 style="margin-bottom:20px;">
        Tableau de bord Administrateur
      </h2>

      <div *ngIf="stats" class="stats-grid">

        <div class="card">
          <h3>Chauffeurs</h3>
          <p>{{ stats.totalChauffeurs }}</p>
        </div>

        <div class="card">
          <h3>Passagers</h3>
          <p>{{ stats.totalPassagers }}</p>
        </div>

        <div class="card">
          <h3>Courses</h3>
          <p>{{ stats.totalCourses }}</p>
        </div>

        <div class="card">
          <h3>Paiements</h3>
          <p>{{ stats.totalPaiements }}</p>
        </div>

      </div>

      <div *ngIf="!stats">
        Chargement des statistiques...
      </div>

    </div>
  `,
  styles: [`
    .stats-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:20px;
      margin-top:20px;
    }

    .card{
      background:white;
      border:1px solid #e5e7eb;
      border-radius:12px;
      padding:24px;
      box-shadow:0 1px 3px rgba(0,0,0,0.05);
    }

    .card h3{
      margin:0;
      font-size:14px;
      color:#64748b;
    }

    .card p{
      margin-top:12px;
      font-size:32px;
      font-weight:700;
      color:#00C853;
    }
  `]
})
export class AdminViewComponent implements OnInit {

  private api = inject(ApiService);

  public stats: AdminStats | null = null;

  ngOnInit(): void {

    this.api.getAdminStats().subscribe({
      next: (data: AdminStats) => {
        console.log('STATS ADMIN :', data);
        this.stats = data;
      },
      error: (err: any) => {
        console.error('Erreur stats admin', err);
      }
    });

  }

}
