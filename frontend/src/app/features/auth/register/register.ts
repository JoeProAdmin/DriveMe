import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private router = inject(Router);

  public currentFlow: 'PASSAGER' | 'CONDUCTEUR' | null = null;
  public currentStep = 1;
  public isSubmitting = false;

  public passengerForm = { nom: '', prenom: '', telephone: '', email: '', selfieBase64: '' };

  public driverForm = {
    nom: '', prenom: '', dateNaissance: '', email: '', telephone: '', adresseResidence: '',
    vehicule: { marque: '', modele: '', annee: null as number | null, immatriculation: '' },
    documents: { cinBase64: '', permisBase64: '', carteGriseBase64: '', assuranceBase64: '', selfieControleBase64: '' },
    photosVehicule: { faceAvantBase64: '', faceArriereBase64: '', plaqueBase64: '' }
  };

  public previews: { [key: string]: string } = {};

  public selectFlow(flow: 'PASSAGER' | 'CONDUCTEUR'): void {
    this.currentFlow = flow;
    this.currentStep = 1;
    this.previews = {};
  }

  public resetFlow(): void {
    this.currentFlow = null;
    this.currentStep = 1;
  }

  public nextStep(): void {
    if (this.currentStep < 4) this.currentStep++;
  }

  public prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  // Correction typage pour éviter les erreurs de compilation
  public onFileSelected(event: Event, targetKey: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.previews[targetKey] = e.target.result as string;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  public submitPassenger(): void {
    this.isSubmitting = true;
    console.log('Inscription Passager:', this.passengerForm);
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/login']);
    }, 1000);
  }

  public submitDriver(): void {
    this.isSubmitting = true;
    console.log('Inscription Conducteur:', this.driverForm);
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/login']);
    }, 1000);
  }
}
