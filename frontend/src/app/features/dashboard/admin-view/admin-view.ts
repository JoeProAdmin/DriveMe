import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, AdminStats } from '../../../core/api.service';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <h2>Statistiques Administrateur</h2>
      <div *ngIf="stats" class="stats-grid">
        <p>Total Chauffeurs: {{stats.totalChauffeurs}}</p>
        <p>Total Passagers: {{stats.totalPassagers}}</p>
        <p>Total Courses: {{stats.totalCourses}}</p>
      </div>
      <div *ngIf="!stats">Chargement...</div>
    </div>
  `
})
export class AdminViewComponent implements OnInit {
  private api = inject(ApiService);
  public stats: AdminStats | null = null;

  ngOnInit() {
    this.api.getAdminStats().subscribe({
      next: (data: AdminStats) => this.stats = data,
      error: (err: any) => console.error('Erreur stats', err)
    });
  }
}
