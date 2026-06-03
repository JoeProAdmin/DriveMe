import { Component, inject, EffectRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private router = inject(Router);
  public isDashboardRoute = false;

  constructor() {
    // Écoute dynamique des changements de routes pour masquer la sidebar sur l'espace public
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.isDashboardRoute = currentUrl.includes('/dashboard') ||
        currentUrl.includes('/chauffeurs') ||
        currentUrl.includes('/passagers') ||
        currentUrl.includes('/courses') ||
        currentUrl.includes('/paiements');
    });
  }
}
