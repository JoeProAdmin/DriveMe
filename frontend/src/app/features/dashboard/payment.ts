import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html'
})
export class PaymentComponent {
  private router = inject(Router);

  // Intégration complète de la grille tarifaire de ton Business Plan
  public selectedPack = { price: 20, km: 200, label: 'Pack Initial' };
  public cardName = '';
  public cardNumber = '';
  public expiry = '';
  public cvc = '';
  public isProcessing = false;

  public changePack(price: number, km: number, label: string): void {
    this.selectedPack = { price, km, label };
  }

  public executePayment(): void {
    if (!this.cardName || !this.cardNumber || !this.expiry || !this.cvc) return;

    this.isProcessing = true;

    // Simulation d'une passerelle bancaire internationale (Stripe/CIH)
    setTimeout(() => {
      this.isProcessing = false;

      // Stockage de la session pour la télémétrie du dashboard
      localStorage.setItem('last_simulated_payment_km', this.selectedPack.km.toString());

      alert(`Paiement sécurisé de ${this.selectedPack.price} € validé.\n+${this.selectedPack.km} points-kilomètres ajoutés à votre espace DriveMe Chauffeur.`);

      // Redirection vers le tableau de suivi
      this.router.navigate(['/dashboard']);
    }, 2000);
  }
}
