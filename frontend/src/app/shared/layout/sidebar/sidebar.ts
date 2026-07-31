import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo';
import { ApiService } from '../../../core/api.service';

@Component({selector:'app-unified-sidebar',standalone:true,imports:[CommonModule,RouterModule,LogoComponent],templateUrl:'./sidebar.html',styleUrl:'./sidebar.scss'})
export class UnifiedSidebarComponent {
  constructor(public readonly apiService: ApiService) {}
  @Input() role = localStorage.getItem('userRole') || 'VISITEUR';
  @Input() email = localStorage.getItem('userEmail') || 'Utilisateur DriveMe';
  @Output() logout = new EventEmitter<void>();
}
