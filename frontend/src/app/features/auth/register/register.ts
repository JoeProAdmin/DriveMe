import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
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
    email: '',
    selfieBase64: ''
  };

  public driverForm = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    telephone: '',
    adresseResidence: '',

    vehicule: {
      marque: '',
      modele: '',
      annee: null as number | null,
      immatriculation: ''
    },

    documents: {
      cinBase64: '',
      permisBase64: '',
      carteGriseBase64: '',
      assuranceBase64: '',
      selfieControleBase64: ''
    },

    photosVehicule: {
      faceAvantBase64: '',
      faceArriereBase64: '',
      plaqueBase64: ''
    }
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
    this.isSubmitting = false;
    this.previews = {};
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

  public onFileSelected(event: Event, targetKey: string): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide.');
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.previews[targetKey] = base64;

      switch (targetKey) {
        case 'passengerSelfie':
          this.passengerForm.selfieBase64 = base64;
          break;

        case 'cin':
          this.driverForm.documents.cinBase64 = base64;
          break;

        case 'permis':
          this.driverForm.documents.permisBase64 = base64;
          break;

        case 'carteGrise':
          this.driverForm.documents.carteGriseBase64 = base64;
          break;

        case 'assurance':
          this.driverForm.documents.assuranceBase64 = base64;
          break;

        case 'selfieControle':
          this.driverForm.documents.selfieControleBase64 = base64;
          break;

        case 'avant':
          this.driverForm.photosVehicule.faceAvantBase64 = base64;
          break;

        case 'arriere':
          this.driverForm.photosVehicule.faceArriereBase64 = base64;
          break;

        case 'plaque':
          this.driverForm.photosVehicule.plaqueBase64 = base64;
          break;
      }
    };

    reader.readAsDataURL(file);
  }

  public submitPassenger(): void {
    if (
      !this.passengerForm.nom ||
      !this.passengerForm.prenom ||
      !this.passengerForm.telephone
    ) {
      alert('Veuillez compléter le nom, le prénom et le téléphone.');
      return;
    }

    const emailFinal =
      this.passengerForm.email && this.passengerForm.email.trim() !== ''
        ? this.passengerForm.email.trim()
        : `${this.passengerForm.telephone.trim()}@driveme.local`;

    const payload = {
      nom: this.passengerForm.nom.trim(),
      prenom: this.passengerForm.prenom.trim(),
      telephone: this.passengerForm.telephone.trim(),
      email: emailFinal,
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
        alert('Erreur inscription passager. Vérifiez email/téléphone.');
      }
    });
  }

  public submitDriver(): void {
    if (
      !this.driverForm.nom ||
      !this.driverForm.prenom ||
      !this.driverForm.telephone ||
      !this.driverForm.email
    ) {
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
        alert('Candidature chauffeur enregistrée. Mot de passe de test : 123456');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Erreur inscription chauffeur :', err);
        alert('Erreur inscription chauffeur. Vérifiez email/téléphone.');
      }
    });
  }
}
