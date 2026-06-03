import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);

  public activeTab = 'overview';
  public currentLang: 'FR' | 'AR' = 'FR';

  // Statistiques issues des objectifs et hypothèses de ton Business Plan DriveMe
  public stats = {
    conducteursInscrits: 400, // Objectif cible initial
    passagersActifs: 1840,    // Hypothèse de ton modèle
    trajetsSimules: 24,
    caPrevisionnel: '108 720' // Recette annuelle prévisionnelle brute en €
  };

  // Suivi applicatif dynamique des demandes d'inscription
  public pendingDrivers = [
    { id: 'CH-9411', name: 'Amine Benjelloun', city: 'Marrakech', status: 'En attente', doc: 'Permis + Assurance' },
    { id: 'CH-8824', name: 'Khadija Mansouri', city: 'Casablanca', status: 'En attente', doc: 'CIN + Fiche Anthropométrique' },
    { id: 'CH-3105', name: 'Youssef El Alami', city: 'Tanger', status: 'En attente', doc: 'Permis de confiance' }
  ];

  public recentLogs: Array<{time: string, text: string, type: string}> = [];

  ngOnInit(): void {
    this.generateLiveLogs();
    this.loadSimulatedPayment();
  }

  private generateLiveLogs(): void {
    this.recentLogs = [
      { time: '11:48', text: 'Nouvelle demande de trajet de gré à gré initiée à Gueliz', type: 'ROUTE' },
      { time: '11:42', text: 'Profil passager vérifié via authentification SMS OTP', type: 'AUTH' }
    ];
  }

  // Permet de vérifier si une simulation de recharge de points-km vient d'avoir lieu
  private loadSimulatedPayment(): void {
    const lastPaid = localStorage.getItem('last_simulated_payment_km');
    if (lastPaid) {
      this.recentLogs.unshift({
        time: 'À l\'instant',
        text: `Flux financier intercepté : Un conducteur a rechargé son compte de ${lastPaid} km`,
        type: 'PAYMENT'
      });
      // Incrémentation factice pour simuler le dynamisme de la plateforme devant le jury
      this.stats.trajetsSimules += 2;
    }
  }

  // Processus d'approbation (Suivi de l'inscription d'un membre)
  public approveDriver(id: string): void {
    this.pendingDrivers = this.pendingDrivers.filter(d => d.id !== id);
    this.stats.conducteursInscrits++;
    this.recentLogs.unshift({
      time: 'À l\'instant',
      text: `Dossier conducteur ${id} approuvé avec succès sur le réseau Maroc`,
      type: 'SYSTEM'
    });
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}

// Double export pour satisfaire la ligne 4 de app.routes.ts
export { DashboardComponent as Dashboard };
