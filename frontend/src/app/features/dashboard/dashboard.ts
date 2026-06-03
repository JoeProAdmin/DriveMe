import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminViewComponent } from './admin-view/admin-view';
import { DriverViewComponent } from './driver-view/driver-view';
import { PassengerViewComponent } from './passenger-view/passenger-view';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AdminViewComponent, DriverViewComponent, PassengerViewComponent],
  template: `
    <div class="dashboard-container">
      <h1>Bienvenue sur votre Dashboard</h1>
      <app-admin-view *ngIf="userRole === 'ADMIN'"></app-admin-view>
      <app-driver-view *ngIf="userRole === 'CHAUFFEUR'"></app-driver-view>
      <app-passenger-view *ngIf="userRole === 'PASSAGER'"></app-passenger-view>
    </div>
  `
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  public userRole: string | null = null;

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    if (!this.userRole) { this.router.navigate(['/login']); }
  }
}
