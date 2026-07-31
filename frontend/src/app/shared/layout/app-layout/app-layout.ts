import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header';
import { UnifiedSidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, UnifiedSidebarComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss'
})
export class AppLayoutComponent {
  private readonly router = inject(Router);

  readonly userRole = localStorage.getItem('userRole') || 'VISITEUR';
  readonly userEmail = localStorage.getItem('userEmail') || 'Utilisateur DriveMe';

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    void this.router.navigate(['/login']);
  }
}
