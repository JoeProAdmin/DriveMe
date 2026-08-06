import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { HeaderComponent } from '../../../shared/layout/header/header';

type Flow = 'PASSAGER' | 'CHAUFFEUR';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private readonly router = inject(Router);
  public readonly api = inject(ApiService);

  public currentFlow: Flow | null = null;
  public currentStep = 1;
  public isSubmitting = false;
  public errorMessage = '';
  public successMessage = '';
  public showPassword = false;

  public accountForm = {
    nom: '', prenom: '', telephone: '', email: '', motDePasse: '', confirmation: ''
  };
  public driverForm = {
    marque: '', modele: '', annee: null as number | null, immatriculation: ''
  };
  public documents = {
    cin: null as File | null,
    permis: null as File | null,
    carteGrise: null as File | null,
    assurance: null as File | null,
    photoAvant: null as File | null,
    photoArriere: null as File | null,
    selfie: null as File | null
  };

  public readonly texts: Record<string, any> = {
    FR: { title:'Créer un compte DriveMe', subtitle:'Choisissez votre profil pour commencer.', passenger:'Je suis passager', passengerDesc:'Commander, négocier et payer mes courses.', driver:'Je suis chauffeur', driverDesc:'Proposer mes prix et gérer mon activité.', account:'Informations du compte', docs:'Documents obligatoires', vehicle:'Informations du véhicule', biometric:'Contrôle biométrique', next:'Continuer', previous:'Retour', submit:'Créer mon compte', submitting:'Création...', login:'Déjà inscrit ? Se connecter', pending:'Le compte chauffeur sera créé avec le statut « en attente de validation ».' },
    EN: { title:'Create a DriveMe account', subtitle:'Choose your profile to get started.', passenger:'I am a passenger', passengerDesc:'Book, negotiate and pay for rides.', driver:'I am a driver', driverDesc:'Offer prices and manage my activity.', account:'Account information', docs:'Required documents', vehicle:'Vehicle information', biometric:'Biometric verification', next:'Continue', previous:'Back', submit:'Create my account', submitting:'Creating...', login:'Already registered? Sign in', pending:'The driver account will be created with “pending validation” status.' },
    AR: { title:'إنشاء حساب DriveMe', subtitle:'اختر نوع حسابك للبدء.', passenger:'أنا راكب', passengerDesc:'طلب الرحلات والتفاوض والدفع.', driver:'أنا سائق', driverDesc:'اقتراح الأسعار وإدارة النشاط.', account:'معلومات الحساب', docs:'الوثائق المطلوبة', vehicle:'معلومات المركبة', biometric:'التحقق البيومتري', next:'متابعة', previous:'رجوع', submit:'إنشاء الحساب', submitting:'جاري الإنشاء...', login:'لديك حساب؟ تسجيل الدخول', pending:'سيتم إنشاء حساب السائق بحالة «في انتظار الموافقة».' },
    ES: { title:'Crear una cuenta DriveMe', subtitle:'Elige tu perfil para comenzar.', passenger:'Soy pasajero', passengerDesc:'Reservar, negociar y pagar viajes.', driver:'Soy conductor', driverDesc:'Proponer precios y gestionar mi actividad.', account:'Información de la cuenta', docs:'Documentos obligatorios', vehicle:'Información del vehículo', biometric:'Control biométrico', next:'Continuar', previous:'Volver', submit:'Crear mi cuenta', submitting:'Creando...', login:'¿Ya está registrado? Iniciar sesión', pending:'La cuenta del conductor se creará con estado «pendiente de validación».' }
  };

  public get currentLang(): 'FR' | 'EN' | 'AR' | 'ES' {
    return this.api.currentLanguage().toUpperCase() as 'FR' | 'EN' | 'AR' | 'ES';
  }

  public changeLanguage(language: string): void {
    this.api.setLanguage(language.toLowerCase() as 'fr' | 'en' | 'ar' | 'es');
  }

  public selectFlow(flow: Flow): void {
    this.currentFlow = flow;
    this.currentStep = 1;
    this.errorMessage = '';
  }

  public resetFlow(): void {
    this.currentFlow = null;
    this.currentStep = 1;
    this.errorMessage = '';
  }

  public nextStep(): void {
    this.errorMessage = '';
    if (!this.validateAccount()) return;
    if (this.currentFlow === 'CHAUFFEUR' && this.currentStep < 4) this.currentStep++;
  }

  public previousStep(): void {
    this.errorMessage = '';
    if (this.currentStep > 1) this.currentStep--; else this.resetFlow();
  }

  public onFileSelected(event: Event, key: keyof RegisterComponent['documents']): void {
    const input = event.target as HTMLInputElement;
    this.documents[key] = input.files?.[0] || null;
  }

  public submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.validateAccount()) return;
    if (this.currentFlow === 'CHAUFFEUR' && !this.validateDriverSteps()) return;

    const payload = {
      nom: this.accountForm.nom.trim(),
      prenom: this.accountForm.prenom.trim(),
      telephone: this.normalizePhone(this.accountForm.telephone),
      email: this.accountForm.email.trim().toLowerCase(),
      motDePasse: this.accountForm.motDePasse,
      role: this.currentFlow,
      marque: this.currentFlow === 'CHAUFFEUR' ? this.driverForm.marque.trim() : undefined,
      modele: this.currentFlow === 'CHAUFFEUR' ? this.driverForm.modele.trim() : undefined,
      annee: this.currentFlow === 'CHAUFFEUR' ? this.driverForm.annee : undefined,
      immatriculation: this.currentFlow === 'CHAUFFEUR' ? this.driverForm.immatriculation.trim() : undefined
    };

    this.isSubmitting = true;
    const inscription$ = this.currentFlow === 'CHAUFFEUR'
      ? this.api.registerChauffeur(this.buildDriverFormData(payload))
      : this.api.registerUser(payload);

    inscription$.subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.storeSession(response.token);
        this.successMessage = 'Compte créé avec succès.';
        setTimeout(() => this.router.navigate(['/dashboard']), 500);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Impossible de créer le compte.';
      }
    });
  }

  private buildDriverFormData(payload: Record<string, unknown>): FormData {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    const mandatory: Array<[string, File | null]> = [
      ['cin', this.documents.cin],
      ['permis', this.documents.permis],
      ['carteGrise', this.documents.carteGrise],
      ['assurance', this.documents.assurance],
      ['selfie', this.documents.selfie]
    ];
    mandatory.forEach(([key, file]) => {
      if (file) formData.append(key, file, file.name);
    });

    if (this.documents.photoAvant) {
      formData.append('photoAvant', this.documents.photoAvant, this.documents.photoAvant.name);
    }
    if (this.documents.photoArriere) {
      formData.append('photoArriere', this.documents.photoArriere, this.documents.photoArriere.name);
    }
    return formData;
  }

  private validateAccount(): boolean {
    const f = this.accountForm;
    if (!f.nom.trim() || !f.prenom.trim() || !f.telephone.trim() || !f.email.trim() || !f.motDePasse) {
      this.errorMessage = 'Tous les champs du compte sont obligatoires.';
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) {
      this.errorMessage = 'Veuillez saisir une adresse email valide.';
      return false;
    }
    if (!/^\+[1-9]\d{7,14}$/.test(this.normalizePhone(f.telephone))) {
      this.errorMessage = 'Numéro international invalide. Utilisez le format E.164, par exemple +212612345678 ou +33612345678.';
      return false;
    }
    if (f.motDePasse.length < 8 || !/[A-Za-z]/.test(f.motDePasse) || !/\d/.test(f.motDePasse)) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.';
      return false;
    }
    if (f.motDePasse !== f.confirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return false;
    }
    return true;
  }

  private validateDriverSteps(): boolean {
    if (!this.driverForm.marque.trim() || !this.driverForm.modele.trim() || !this.driverForm.annee || !this.driverForm.immatriculation.trim()) {
      this.errorMessage = 'Complétez les informations du véhicule.';
      this.currentStep = 3;
      return false;
    }
    const missingDocument = !this.documents.cin || !this.documents.permis || !this.documents.carteGrise || !this.documents.assurance || !this.documents.selfie;
    if (missingDocument) {
      this.errorMessage = 'Ajoutez les quatre documents obligatoires et le selfie de contrôle.';
      this.currentStep = !this.documents.cin || !this.documents.permis || !this.documents.carteGrise || !this.documents.assurance ? 2 : 4;
      return false;
    }
    return true;
  }

  private normalizePhone(value: string): string {
    let phone = value.trim().replace(/[\s().-]/g, '');
    if (phone.startsWith('00')) phone = '+' + phone.substring(2);
    if (/^0\d{9}$/.test(phone)) phone = '+212' + phone.substring(1);
    return phone;
  }

  private storeSession(token: string): void {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', payload.role);
    localStorage.setItem('userEmail', payload.sub);
  }
}
