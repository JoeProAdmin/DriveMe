import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Bienvenue sur votre Dashboard</h1>

      <div *ngIf="userRole === 'ADMIN'">
        <h2>Statistiques Administrateur</h2>
        </div>

      <div *ngIf="userRole === 'CHAUFFEUR'">
        <h2>Gestion de mes trajets</h2>
      </div>

      <div *ngIf="userRole === 'PASSAGER'">
        <h2>Recherche de trajet</h2>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  public userRole: string | null = null;

  ngOnInit() {
    // Récupération du rôle depuis le localStorage (ou mieux, via ton ApiService)
    this.userRole = localStorage.getItem('userRole');

    if (!this.userRole) {
      this.router.navigate(['/login']);
    }
  }
}
