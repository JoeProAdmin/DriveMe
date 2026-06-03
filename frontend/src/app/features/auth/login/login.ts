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

  public currentLang: 'FR' | 'AR' = 'FR';
  public showQrModal = false;
  public userInput = '';

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
    }
  };

  public toggleLanguage(): void {
    this.currentLang = this.currentLang === 'FR' ? 'AR' : 'FR';
    document.documentElement.dir = this.currentLang === 'AR' ? 'rtl' : 'ltr';
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
