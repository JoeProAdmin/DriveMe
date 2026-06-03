import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private router = inject(Router);

  // Variable de langue unifiée sur 4 déclinaisons
  public currentLang: 'FR' | 'AR' | 'EN' | 'ES' = 'FR';
  public showQrModal = false;
  public userInput = '';

  // Matrice de traduction quadrilingue professionnelle
  public dictionary = {
    FR: {
      title: 'Indiquez votre numéro de téléphone ou votre adresse e-mail',
      placeholder: 'Saisissez un numéro de téléphone ou une adresse e-mail',
      btnContinue: 'Continuer',
      or: 'ou',
      google: 'Continuer avec Google',
      apple: 'Continuer avec Apple',
      qrCode: 'Connectez-vous avec le QR code',
      legal: 'Vous acceptez de recevoir un code de vérification par SMS ou sur WhatsApp. Des frais de messagerie SMS et de traitement de données réseau peuvent s\'appliquer au Maroc.',
      qrTitle: 'Connexion par QR Code',
      qrDesc: 'Scannez ce code avec votre application mobile DriveMe Passager ou Chauffeur pour vous connecter instantanément.'
    },
    AR: {
      title: 'أدخل رقم الهاتف أو البريد الإلكتروني',
      placeholder: 'أدخل رقم الهاتف أو البريد الإلكتروني الخاص بك',
      btnContinue: 'متابعة',
      or: 'أو',
      google: 'المتابعة باستخدام Google',
      apple: 'المتابعة باستخدام Apple',
      qrCode: 'تسجيل الدخول باستخدام رمز QR',
      legal: 'بالمتابعة، فإنك توافق على تلقي رمز التحقق عبر الرسائل النصية القصيرة أو WhatsApp. قد يتم تطبيق رسوم البيانات والرسائل في المغرب.',
      qrTitle: 'تسجيل الدخول عبر رمز QR',
      qrDesc: 'امسح هذا الرمز باستخدام تطبيق DriveMe الخاص بك لتسجيل الدخول الفوري.'
    },
    EN: {
      title: 'Enter your phone number or email address',
      placeholder: 'Enter your phone number or email address',
      btnContinue: 'Continue',
      or: 'or',
      google: 'Continue with Google',
      apple: 'Continue with Apple',
      qrCode: 'Log in with QR code',
      legal: 'By proceeding, you agree to receive a verification code via SMS or WhatsApp. Message and data rates may apply.',
      qrTitle: 'QR Code Login',
      qrDesc: 'Scan this code with your DriveMe app to log in instantly.'
    },
    ES: {
      title: 'Introduzca su número de teléfono o correo electrónico',
      placeholder: 'Introduzca su número de teléfono o correo electrónico',
      btnContinue: 'Continuar',
      or: 'o',
      google: 'Continuar con Google',
      apple: 'Continuar con Apple',
      qrCode: 'Iniciar sesión con código QR',
      legal: 'Al continuar, acepta recibir un código de verificación por SMS o WhatsApp. Se pueden aplicar tarifas de red.',
      qrTitle: 'Inicio con Código QR',
      qrDesc: 'Escanee este código con su aplicación DriveMe para iniciar sesión de inmediato.'
    }
  };

  // Sélecteur explicite de langue
  public setLanguage(lang: 'FR' | 'AR' | 'EN' | 'ES'): void {
    this.currentLang = lang;
    document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr';
  }

  public onSubmit(): void {
    if (!this.userInput.trim()) return;
    if (this.userInput.includes('admin')) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/create-course']);
    }
  }

  public toggleQrModal(status: boolean): void {
    this.showQrModal = status;
  }
}
