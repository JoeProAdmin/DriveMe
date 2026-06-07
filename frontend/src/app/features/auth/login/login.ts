import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './login.html'
})
export class LoginComponent {

  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  public loginData = {
    email: '',
    motDePasse: ''
  };

  public currentLang: 'FR' | 'AR' | 'EN' | 'ES' = 'FR';

  public dropdownOpen = false;
  public showQrModal = false;

  public dictionary: any = {
    FR: {
      title: 'Indiquez votre numéro ou email',
      placeholderEmail: 'Email',
      placeholderPass: 'Mot de passe',
      btnContinue: 'Continuer',
      legal: 'Vous acceptez de recevoir un code de vérification par SMS ou sur WhatsApp. Des frais de messagerie SMS et de transfert de données peuvent s\'appliquer.'
    },
    EN: {
      title: 'Enter your number or email',
      placeholderEmail: 'Email',
      placeholderPass: 'Password',
      btnContinue: 'Continue',
      legal: 'You agree to receive a verification code by SMS or WhatsApp. SMS and data rates may apply.'
    },
    AR: {
      title: 'أدخل رقمك أو بريدك الإلكتروني',
      placeholderEmail: 'البريد الإلكتروني',
      placeholderPass: 'كلمة السر',
      btnContinue: 'متابعة',
      legal: 'أنت توافق على تلقي رمز التحقق عبر الرسائل القصيرة أو واتساب. قد يتم تطبيق رسوم الرسائل القصيرة ونقل البيانات.'
    },
    ES: {
      title: 'Ingrese su número o correo',
      placeholderEmail: 'Correo',
      placeholderPass: 'Contraseña',
      btnContinue: 'Continuar',
      legal: 'Usted acepta recibir un código de verificación por SMS o WhatsApp. Se pueden aplicar tarifas de SMS y transferencia de datos.'
    }
  };

  public onSubmit(): void {

    console.log('Tentative de connexion...');

    this.api.login(this.loginData).subscribe({

      next: (res: any) => {

        console.log('TOKEN RECU :', res.token);

        localStorage.setItem('token', res.token);

        const payload = JSON.parse(
          atob(res.token.split('.')[1])
        );

        console.log('PAYLOAD JWT :', payload);

        localStorage.setItem('userRole', payload.role);
        localStorage.setItem('userEmail', payload.sub);

        this.router.navigate(['/dashboard']);

      },

      error: (err: any) => {

        console.error('Erreur authentification :', err);

        alert(
          err?.error?.message ||
          'Erreur de connexion'
        );

      }

    });

  }

  public changeLangViaDropdown(
    lang: 'FR' | 'AR' | 'EN' | 'ES'
  ): void {

    this.currentLang = lang;

    this.api.setLanguage(
      lang.toLowerCase() as any
    );

    this.dropdownOpen = false;
  }

  public toggleQrModal(
    status: boolean
  ): void {

    this.showQrModal = status;

  }

}
