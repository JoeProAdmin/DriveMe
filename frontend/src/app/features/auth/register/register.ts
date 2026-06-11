import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  public currentFlow: 'PASSAGER' | 'CONDUCTEUR' | null = null;
  public currentStep = 1;
  public isSubmitting = false;

  public passengerForm = {
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  };

  public driverForm = {
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  };

  public selectFlow(flow: 'PASSAGER' | 'CONDUCTEUR'): void {
    this.currentFlow = flow;
    this.currentStep = 1;
  }

  public resetFlow(): void {
    this.currentFlow = null;
    this.currentStep = 1;
    this.isSubmitting = false;
  }

  public nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  public prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  public submitPassenger(): void {
    if (!this.passengerForm.nom || !this.passengerForm.prenom || !this.passengerForm.telephone) {
      alert('Veuillez compléter le nom, le prénom et le téléphone.');
      return;
    }

    const payload = {
      nom: this.passengerForm.nom.trim(),
      prenom: this.passengerForm.prenom.trim(),
      telephone: this.passengerForm.telephone.trim(),
      email: this.passengerForm.email && this.passengerForm.email.trim() !== ''
        ? this.passengerForm.email.trim()
        : `${this.passengerForm.telephone.trim()}@driveme.local`,
      motDePasse: '123456',
      role: 'PASSAGER'
    };

    this.isSubmitting = true;

    this.api.registerUser(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Inscription passager réussie. Mot de passe de test : 123456');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Erreur inscription passager :', err);
        alert('Erreur inscription passager. Essayez un autre email ou téléphone.');
      }
    });
  }

  public submitDriver(): void {
    if (!this.driverForm.nom || !this.driverForm.prenom || !this.driverForm.telephone || !this.driverForm.email) {
      alert('Veuillez compléter le nom, le prénom, le téléphone et l’email.');
      return;
    }

    const payload = {
      nom: this.driverForm.nom.trim(),
      prenom: this.driverForm.prenom.trim(),
      telephone: this.driverForm.telephone.trim(),
      email: this.driverForm.email.trim(),
      motDePasse: '123456',
      role: 'CHAUFFEUR'
    };

    this.isSubmitting = true;

    this.api.registerUser(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Inscription chauffeur réussie. Mot de passe de test : 123456');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Erreur inscription chauffeur :', err);
        alert('Erreur inscription chauffeur. Essayez un autre email ou téléphone.');
      }
    });
  }
}
