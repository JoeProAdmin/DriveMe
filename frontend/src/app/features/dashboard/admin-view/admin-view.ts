import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, AdminStats } from '../../../core/api.service';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">

      <div class="dashboard-header">
        <div>
          <h1>Centre de pilotage DriveMe</h1>
          <p>
            Supervision des chauffeurs, passagers, courses et paiements.
          </p>
        </div>
      </div>

      <div *ngIf="stats" class="stats-grid">

        <div class="card">
          <span class="label">CHAUFFEURS</span>
          <p>{{ stats.totalChauffeurs }}</p>
        </div>

        <div class="card">
          <span class="label">PASSAGERS</span>
          <p>{{ stats.totalPassagers }}</p>
        </div>

        <div class="card">
          <span class="label">COURSES</span>
          <p>{{ stats.totalCourses }}</p>
        </div>

        <div class="card">
          <span class="label">PAIEMENTS</span>
          <p>{{ stats.totalPaiements }}</p>
        </div>

      </div>

      <div class="quick-actions">

        <div class="action-card">
          <h3>Gestion Chauffeurs</h3>
          <p>
            Validation et suivi des chauffeurs inscrits.
          </p>
        </div>

        <div class="action-card">
          <h3>Gestion Passagers</h3>
          <p>
            Consultation des comptes passagers.
          </p>
        </div>

        <div class="action-card">
          <h3>Suivi des Courses</h3>
          <p>
            Contrôle des trajets en cours et terminés.
          </p>
        </div>

        <div class="action-card">
          <h3>Paiements</h3>
          <p>
            Vérification des transactions DriveMe.
          </p>
        </div>

      </div>

      <div *ngIf="!stats" class="loading">
        Chargement des statistiques...
      </div>

    </div>
  `,
  styles: [`

    .admin-dashboard{
      padding:30px;
    }

    .dashboard-header{
      margin-bottom:30px;
    }

    .dashboard-header h1{
      margin:0;
      font-size:32px;
      font-weight:700;
      color:#0f172a;
    }

    .dashboard-header p{
      margin-top:10px;
      color:#64748b;
      font-size:15px;
    }

    .stats-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:20px;
      margin-bottom:30px;
    }

    .card{
      background:white;
      border:1px solid #e5e7eb;
      border-radius:14px;
      padding:24px;
      box-shadow:0 2px 8px rgba(0,0,0,0.05);
    }

    .label{
      display:block;
      font-size:12px;
      font-weight:700;
      color:#64748b;
      letter-spacing:1px;
    }

    .card p{
      margin-top:15px;
      font-size:36px;
      font-weight:700;
      color:#00C853;
    }

    .quick-actions{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
      gap:20px;
    }

    .action-card{
      background:white;
      border:1px solid #e5e7eb;
      border-radius:14px;
      padding:20px;
    }

    .action-card h3{
      margin:0 0 10px 0;
      color:#0f172a;
      font-size:18px;
    }

    .action-card p{
      margin:0;
      color:#64748b;
      line-height:1.5;
    }

    .loading{
      padding:30px;
      text-align:center;
      color:#64748b;
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
