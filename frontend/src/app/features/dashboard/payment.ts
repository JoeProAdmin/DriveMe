import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-payment-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-card-box" [attr.dir]="apiService.isRtlMode() ? 'rtl' : 'ltr'">
      <div class="payment-brand-header">
        <h4>Passerelle de Paiement Sécurisée</h4>
        <span class="badge-secure">CMI Valide</span>
      </div>

      <p class="amount-text">Montant à régler : <strong>{{ montant }} MAD</strong></p>

      <form (ngSubmit)="traiterPaiement()">
        <div class="input-minimal">
          <label>Nom du titulaire de la carte</label>
          <input type="text" [(ngModel)]="payModel.titulaire" name="titulaire" placeholder="Youssef Qarnouf" required>
        </div>

        <div class="input-minimal">
          <label>Numéro de carte (CIH / Attijari / BMCE)</label>
          <input type="text" [(ngModel)]="payModel.numeroCarte" name="numeroCarte" placeholder="4111 2222 3333 4444" required>
        </div>

        <div class="twin-inputs">
          <div class="input-minimal">
            <label>Expiration</label>
            <input type="text" [(ngModel)]="payModel.expiration" name="expiration" placeholder="12/28" required>
          </div>
          <div class="input-minimal">
            <label>CVV</label>
            <input type="password" [(ngModel)]="payModel.cvv" name="cvv" placeholder="•••" required>
          </div>
        </div>

        <button type="submit" class="btn-pay-maroc" [disabled]="isProcessing">
          <span *ngIf="!isProcessing">Confirmer le paiement de {{ montant }} MAD</span>
          <span *ngIf="isProcessing">Autorisation bancaire en cours...</span>
        </button>
      </form>

      <div *ngIf="paySuccess" class="alert-pay success">Transaction acceptée par la passerelle marocaine.</div>
    </div>
  `,
  styles: [`
    .payment-card-box { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; max-width: 420px; box-sizing: border-box; }
    .payment-brand-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .payment-brand-header h4 { margin: 0; font-size: 1rem; color: #0f172a; }
    .badge-secure { background-color: #e0f2fe; color: #0369a1; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 0.25rem; }
    .amount-text { font-size: 1rem; color: #334155; margin-bottom: 1.5rem; }
    .input-minimal { display: flex; flex-direction: column; margin-bottom: 1rem; }
    .input-minimal label { font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem; }
    .input-minimal input { border: 1px solid #cbd5e1; padding: 0.55rem; border-radius: 0.375rem; font-size: 0.9rem; }
    .input-minimal input:focus { border-color: #00A86B; outline: none; }
    .twin-inputs { display: flex; gap: 1rem; }
    .btn-pay-maroc { width: 100%; background-color: #00A86B; color: #ffffff; border: none; padding: 0.75rem; font-weight: 700; border-radius: 0.375rem; cursor: pointer; margin-top: 0.5rem; }
    .alert-pay.success { background-color: #dcfce7; color: #15803d; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.85rem; margin-top: 1rem; text-align: center; font-weight: 600; }
  `]
})
export class PaymentSimulation {
  @Input() montant: number = 0;
  public payModel = { titulaire: '', numeroCarte: '', expiration: '', cvv: '' };
  public isProcessing = false;
  public paySuccess = false;

  constructor(public apiService: ApiService) {}

  public traiterPaiement(): void {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.paySuccess = true;
    }, 2000);
  }
}
