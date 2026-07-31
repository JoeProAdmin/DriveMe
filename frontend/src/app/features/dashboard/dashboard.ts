import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminViewComponent } from './admin-view/admin-view';
import { DriverViewComponent } from './driver-view/driver-view';
import { PassengerViewComponent } from './passenger-view/passenger-view';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AdminViewComponent, DriverViewComponent, PassengerViewComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  public userRole = '';
  public userEmail = '';

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';
    if (!this.userRole) this.router.navigate(['/login']);
  }

}
