import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { ApiService } from '../../../core/api.service';
import { HeaderComponent } from '../../../shared/layout/header/header';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  styleUrls: ['../login/login.css'],
  template: `
    <div class="auth-page" [class.rtl]="lang === 'AR'">
      <app-header mode="auth" [currentLang]="lang"
        (languageChange)="changeLanguage($any($event))" />
      <main class="auth-main">
        <section class="auth-card">
          <h1>{{ resetting ? t.resetTitle : t.forgotTitle }}</h1>
          <p class="subtitle">{{ resetting ? t.resetIntro : t.forgotIntro }}</p>

          <div *ngIf="error" class="message error" role="alert">{{ error }}</div>
          <div *ngIf="success" class="message information" role="status">
            {{ resetting ? t.resetSuccess : t.forgotSuccess }}
          </div>

          <form *ngIf="!success" (ngSubmit)="submit()">
            <ng-container *ngIf="!resetting; else passwordFields">
              <label for="reset-email">{{ t.email }}</label>
              <input id="reset-email" name="email" type="email"
                [(ngModel)]="email" autocomplete="email"
                maxlength="150" required [disabled]="busy">
            </ng-container>

            <ng-template #passwordFields>
              <label for="new-password">{{ t.password }}</label>
              <input id="new-password" name="password" type="password"
                [(ngModel)]="password" autocomplete="new-password"
                minlength="12" maxlength="72" required [disabled]="busy">
              <p class="subtitle">{{ t.requirements }}</p>
              <label for="confirm-password">{{ t.confirm }}</label>
              <input id="confirm-password" name="confirmation" type="password"
                [(ngModel)]="confirmation" autocomplete="new-password"
                minlength="12" maxlength="72" required [disabled]="busy">
            </ng-template>

            <button class="primary" type="submit"
              [disabled]="busy || (resetting && !token)"
              [attr.aria-busy]="busy">
              {{ busy ? t.busy : (resetting ? t.save : t.send) }}
            </button>
          </form>

          <a *ngIf="resetting" routerLink="/forgot-password" class="register-link">
            {{ t.newLink }}
          </a>
          <a routerLink="/login" class="register-link">{{ t.back }}</a>
        </section>
      </main>
    </div>
  `
})
export class PasswordResetComponent {
  readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly resetting = this.route.snapshot.url[0]?.path === 'reset-password';
  email = '';
  password = '';
  confirmation = '';
  token = '';
  busy = false;
  success = false;
  error = '';

  readonly texts = {
    FR: {
      forgotTitle: 'Mot de passe oublié ?',
      forgotIntro: 'Indiquez l’adresse email de votre compte DriveMe.',
      resetTitle: 'Nouveau mot de passe',
      resetIntro: 'Choisissez un nouveau mot de passe pour votre compte.',
      email: 'Adresse email', password: 'Nouveau mot de passe',
      confirm: 'Confirmer le mot de passe',
      requirements: 'Au moins 12 caractères, une lettre et un chiffre. Maximum 72 octets.',
      send: 'Recevoir un lien', save: 'Enregistrer mon mot de passe',
      busy: 'Traitement en cours…', back: 'Retour à la connexion',
      newLink: 'Demander un nouveau lien',
      forgotSuccess: 'Si un compte correspond à cette adresse, un lien vous sera envoyé. Vérifiez aussi vos courriers indésirables.',
      resetSuccess: 'Votre mot de passe a été modifié. Reconnectez-vous avec votre nouveau mot de passe.',
      invalidEmail: 'Indiquez une adresse email valide.',
      mismatch: 'Les deux mots de passe doivent être identiques.',
      invalidPassword: 'Respectez les exigences du nouveau mot de passe.',
      invalidLink: 'Lien invalide, expiré ou déjà utilisé. Demandez un nouveau lien.',
      unavailable: 'Le service est momentanément indisponible. Réessayez plus tard.'
    },
    EN: {
      forgotTitle: 'Forgot password?',
      forgotIntro: 'Enter the email address of your DriveMe account.',
      resetTitle: 'New password',
      resetIntro: 'Choose a new password for your account.',
      email: 'Email address', password: 'New password', confirm: 'Confirm password',
      requirements: 'At least 12 characters, a letter and a number. Maximum 72 bytes.',
      send: 'Send me a link', save: 'Save my password', busy: 'Processing…',
      back: 'Back to sign in', newLink: 'Request a new link',
      forgotSuccess: 'If an account matches this address, a link will be sent. Also check your spam folder.',
      resetSuccess: 'Your password has been changed. Sign in with your new password.',
      invalidEmail: 'Enter a valid email address.',
      mismatch: 'Both passwords must match.',
      invalidPassword: 'Follow the new password requirements.',
      invalidLink: 'Invalid, expired or already used link. Request a new link.',
      unavailable: 'The service is temporarily unavailable. Try again later.'
    },
    AR: {
      forgotTitle: 'نسيت كلمة المرور؟',
      forgotIntro: 'أدخل البريد الإلكتروني لحسابك في DriveMe.',
      resetTitle: 'كلمة مرور جديدة',
      resetIntro: 'اختر كلمة مرور جديدة لحسابك.',
      email: 'البريد الإلكتروني', password: 'كلمة المرور الجديدة',
      confirm: 'تأكيد كلمة المرور',
      requirements: '12 محرفاً على الأقل، مع حرف لاتيني ورقم. الحد الأقصى 72 بايت.',
      send: 'إرسال رابط', save: 'حفظ كلمة المرور', busy: 'جار المعالجة…',
      back: 'العودة إلى تسجيل الدخول', newLink: 'طلب رابط جديد',
      forgotSuccess: 'إذا كان هناك حساب بهذا البريد فسيُرسل رابط. تحقق أيضاً من البريد غير المرغوب فيه.',
      resetSuccess: 'تم تغيير كلمة المرور. سجّل الدخول بكلمة المرور الجديدة.',
      invalidEmail: 'أدخل بريداً إلكترونياً صالحاً.',
      mismatch: 'يجب أن تتطابق كلمتا المرور.',
      invalidPassword: 'يرجى احترام متطلبات كلمة المرور الجديدة.',
      invalidLink: 'الرابط غير صالح أو منتهي أو مستخدم. اطلب رابطاً جديداً.',
      unavailable: 'الخدمة غير متاحة مؤقتاً. حاول لاحقاً.'
    },
    ES: {
      forgotTitle: '¿Olvidó su contraseña?',
      forgotIntro: 'Indique el correo de su cuenta DriveMe.',
      resetTitle: 'Nueva contraseña',
      resetIntro: 'Elija una nueva contraseña para su cuenta.',
      email: 'Correo electrónico', password: 'Nueva contraseña',
      confirm: 'Confirmar contraseña',
      requirements: 'Al menos 12 caracteres, una letra y un número. Máximo 72 bytes.',
      send: 'Recibir un enlace', save: 'Guardar contraseña', busy: 'Procesando…',
      back: 'Volver al acceso', newLink: 'Solicitar un nuevo enlace',
      forgotSuccess: 'Si existe una cuenta con este correo, recibirá un enlace. Revise también el correo no deseado.',
      resetSuccess: 'Su contraseña ha cambiado. Acceda con la nueva contraseña.',
      invalidEmail: 'Indique un correo válido.',
      mismatch: 'Las contraseñas deben coincidir.',
      invalidPassword: 'Respete los requisitos de la nueva contraseña.',
      invalidLink: 'Enlace inválido, caducado o utilizado. Solicite uno nuevo.',
      unavailable: 'Servicio temporalmente no disponible. Inténtelo más tarde.'
    }
  };

  get lang(): 'FR' | 'EN' | 'AR' | 'ES' {
    return this.api.currentLanguage().toUpperCase() as 'FR' | 'EN' | 'AR' | 'ES';
  }

  get t() { return this.texts[this.lang]; }

  constructor() {
    if (this.resetting) {
      this.token = new URLSearchParams(this.route.snapshot.fragment ?? '').get('token') ?? '';
      if (!/^[A-Za-z0-9_-]{43}$/.test(this.token)) {
        this.token = '';
        this.error = this.t.invalidLink;
      }
      // Retire le jeton de l'adresse affichée et le conserve seulement en mémoire.
      void this.router.navigate([], {
        relativeTo: this.route, fragment: '', replaceUrl: true,
        queryParamsHandling: 'preserve'
      });
    }
  }

  changeLanguage(language: 'FR' | 'EN' | 'AR' | 'ES'): void {
    this.api.setLanguage(language.toLowerCase() as 'fr' | 'en' | 'ar' | 'es');
  }

  submit(): void {
    if (this.busy) return;
    this.error = '';

    if (this.resetting) {
      if (!this.token) { this.error = this.t.invalidLink; return; }
      if (this.password !== this.confirmation) {
        this.error = this.t.mismatch; return;
      }
      if (this.password.length < 12
          || new TextEncoder().encode(this.password).length > 72
          || !/[A-Za-z]/.test(this.password) || !/\d/.test(this.password)) {
        this.error = this.t.invalidPassword; return;
      }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())
               || this.email.trim().length > 150) {
      this.error = this.t.invalidEmail; return;
    }

    this.busy = true;
    const endpoint = this.resetting ? 'reset-password' : 'forgot-password';
    const body = this.resetting
      ? { token: this.token, motDePasse: this.password }
      : { email: this.email.trim() };

    this.http.post(`${environment.apiUrl}/auth/${endpoint}`, body).pipe(
      timeout(15000),
      finalize(() => { this.busy = false; this.cdr.markForCheck(); })
    ).subscribe({
      next: () => {
        this.success = true;
        this.password = '';
        this.confirmation = '';
        if (this.resetting) {
          this.token = '';
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
        }
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.error = this.resetting && err?.status === 400
          ? this.t.invalidLink : this.t.unavailable;
        this.cdr.markForCheck();
      }
    });
  }
}
