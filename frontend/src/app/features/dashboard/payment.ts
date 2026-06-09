import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type PaymentMethod = 'CARD' | 'CASH' | 'LOCAL_WALLET';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html'
})
export class PaymentComponent {
  private router = inject(Router);

  public selectedPack = {
    price: 250,
    credits: 275,
    label: 'Pack Éco'
  };

  public selectedMethod: PaymentMethod = 'CARD';

  public cardName = '';
  public cardNumber = '';
  public expiry = '';
  public cvc = '';
  public isProcessing = false;

  public changePack(price: number, credits: number, label: string): void {
    this.selectedPack = { price, credits, label };
  }

  public changeMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
  }

  public executePayment(): void {
    if (this.selectedMethod === 'CARD') {
      if (!this.cardName || !this.cardNumber || !this.expiry || !this.cvc) {
        alert('Veuillez compléter les informations de carte bancaire.');
        return;
      }
    }

    this.isProcessing = true;

    setTimeout(() => {
      this.isProcessing = false;

      localStorage.setItem('last_payment_amount_mad', this.selectedPack.price.toString());
      localStorage.setItem('last_driver_credits', this.selectedPack.credits.toString());
      localStorage.setItem('last_payment_method', this.selectedMethod);

      alert(
        `Recharge DriveMe validée.\n\n` +
        `Pack : ${this.selectedPack.label}\n` +
        `Montant : ${this.selectedPack.price} MAD\n` +
        `Crédits chauffeur ajoutés : ${this.selectedPack.credits}\n\n` +
        `Modèle économique : DriveMe facture les chauffeurs via des recharges prépayées.`
      );

      this.router.navigate(['/dashboard']);
    }, 1500);
  }
}
