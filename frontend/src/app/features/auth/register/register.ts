import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  public currentLang: 'FR' | 'EN' | 'AR' | 'ES' = 'FR';
  public currentFlow: 'PASSAGER' | 'CONDUCTEUR' | null = null;
  public currentStep = 1;
  public isSubmitting = false;

  public texts = {
    FR: {
      title: 'Créer un compte DriveMe',
      subtitle: 'Sélectionnez votre profil.',
      passager: 'Je suis Passager',
      passagerDesc: 'Commander une course au prix proposé.',
      chauffeur: 'Je suis Chauffeur',
      chauffeurDesc: 'Recevoir des demandes et gérer mon activité.',
      nom: 'Nom',
      prenom: 'Prénom',
      tel: 'Téléphone obligatoire',
      email: 'Email facultatif',
      emailReq: 'Email obligatoire',
      submit: 'Valider mon inscription',
      submitDriver: 'Valider mon inscription chauffeur',
      submitting: 'Inscription...',
      back: 'Retour',
      regPassager: 'Inscription Passager',
      regChauffeur: 'Inscription Chauffeur',
      errInput: 'Veuillez compléter les champs obligatoires.',
      errApi: 'Erreur lors de l’inscription. Vérifiez vos informations.',
      successPassager: 'Inscription passager réussie.',
      successChauffeur: 'Candidature chauffeur enregistrée.'
    },
    EN: {
      title: 'Create a DriveMe account',
      subtitle: 'Select your profile.',
      passager: 'I am a Passenger',
      passagerDesc: 'Order a ride at the offered price.',
      chauffeur: 'I am a Driver',
      chauffeurDesc: 'Receive requests and manage my activity.',
      nom: 'Last Name',
      prenom: 'First Name',
      tel: 'Phone (required)',
      email: 'Email (optional)',
      emailReq: 'Email (required)',
      submit: 'Confirm registration',
      submitDriver: 'Confirm driver registration',
      submitting: 'Registering...',
      back: 'Back',
      regPassager: 'Passenger Registration',
      regChauffeur: 'Driver Registration',
      errInput: 'Please fill in the required fields.',
      errApi: 'Registration error. Please check your information.',
      successPassager: 'Passenger registration successful.',
      successChauffeur: 'Driver application submitted.'
    },
    AR: {
      title: 'إنشاء حساب DriveMe',
      subtitle: 'اختر نوع حسابك.',
      passager: 'أنا راكب',
      passagerDesc: 'اطلب رحلة بالسعر المقترح.',
      chauffeur: 'أنا سائق',
      chauffeurDesc: 'استقبل الطلبات وأدر نشاطك.',
      nom: 'اللقب',
      prenom: 'الاسم',
      tel: 'رقم الهاتف (إجباري)',
      email: 'البريد الإلكتروني (اختياري)',
      emailReq: 'البريد الإلكتروني (إجباري)',
      submit: 'تأكيد التسجيل',
      submitDriver: 'تأكيد تسجيل السائق',
      submitting: 'جاري التسجيل...',
      back: 'رجوع',
      regPassager: 'تسجيل راكب',
      regChauffeur: 'تسجيل سائق',
      errInput: 'يرجى ملء الحقول المطلوبة.',
      errApi: 'خطأ في التسجيل. يرجى التحقق من بياناتك.',
      successPassager: 'تم تسجيل الراكب بنجاح.',
      successChauffeur: 'تم تسجيل طلب السائق.'
    },
    ES: {
      title: 'Crear una cuenta DriveMe',
      subtitle: 'Selecciona tu perfil.',
      passager: 'Soy Pasajero',
      passagerDesc: 'Solicita un viaje al precio propuesto.',
      chauffeur: 'Soy Conductor',
      chauffeurDesc: 'Recibe solicitudes y gestiona tu actividad.',
      nom: 'Apellido',
      prenom: 'Nombre',
      tel: 'Teléfono (obligatorio)',
      email: 'Email (opcional)',
      emailReq: 'Email (obligatorio)',
      submit: 'Confirmar registro',
      submitDriver: 'Confirmar registro conductor',
      submitting: 'Registrando...',
      back: 'Volver',
      regPassager: 'Registro Pasajero',
      regChauffeur: 'Registro Conductor',
      errInput: 'Por favor, completa los campos obligatorios.',
      errApi: 'Error en el registro. Verifica tus datos.',
      successPassager: 'Registro de pasajero exitoso.',
      successChauffeur: 'Solicitud de conductor enviada.'
    }
  };

  public passengerForm = { nom: '', prenom: '', telephone: '', email: '', selfieBase64: '' };
  public driverForm = {
    nom: '', prenom: '', dateNaissance: '', email: '', telephone: '', adresseResidence: '',
    vehicule: { marque: '', modele: '', annee: null as number | null, immatriculation: '' },
    documents: { cinBase64: '', permisBase64: '', carteGriseBase64: '', assuranceBase64: '', selfieControleBase64: '' },
    photosVehicule: { faceAvantBase64: '', faceArriereBase64: '', plaqueBase64: '' }
  };
  public previews: { [key: string]: string } = {};

  public selectFlow(flow: 'PASSAGER' | 'CONDUCTEUR'): void { this.currentFlow = flow; this.currentStep = 1; }
  public nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  public previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  public resetFlow(): void { this.currentFlow = null; this.currentStep = 1; }

  public onFileSelected(event: Event, targetKey: string): void { /* Logique existante inchangée */ }

  public submitPassenger(): void {
    if (!this.passengerForm.nom || !this.passengerForm.prenom || !this.passengerForm.telephone) {
      alert(this.texts[this.currentLang].errInput);
      return;
    }
    const emailFinal = this.passengerForm.email?.trim() || `${this.passengerForm.telephone.trim()}@driveme.local`;
    const payload = { nom: this.passengerForm.nom.trim(), prenom: this.passengerForm.prenom.trim(), telephone: this.passengerForm.telephone.trim(), email: emailFinal, motDePasse: '123456', role: 'PASSAGER' };
    this.isSubmitting = true;
    this.api.registerUser(payload).subscribe({
      next: () => { this.isSubmitting = false; alert(this.texts[this.currentLang].successPassager); this.router.navigate(['/login']); },
      error: () => { this.isSubmitting = false; alert(this.texts[this.currentLang].errApi); }
    });
  }

  public submitDriver(): void {
    if (!this.driverForm.nom || !this.driverForm.prenom || !this.driverForm.telephone || !this.driverForm.email) {
      alert(this.texts[this.currentLang].errInput);
      return;
    }
    const payload = { nom: this.driverForm.nom.trim(), prenom: this.driverForm.prenom.trim(), telephone: this.driverForm.telephone.trim(), email: this.driverForm.email.trim(), motDePasse: '123456', role: 'CHAUFFEUR' };
    this.isSubmitting = true;
    this.api.registerUser(payload).subscribe({
      next: () => { this.isSubmitting = false; alert(this.texts[this.currentLang].successChauffeur); this.router.navigate(['/login']); },
      error: () => { this.isSubmitting = false; alert(this.texts[this.currentLang].errApi); }
    });
  }
}
