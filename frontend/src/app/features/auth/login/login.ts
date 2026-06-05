import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  // Correction : Remplacement de userInput par les champs attendus par le backend
  public loginData = {
    email: '',
    motDePasse: ''
  };

  public currentLang: 'FR' | 'AR' | 'EN' | 'ES' = 'FR';
  public dropdownOpen = false;
  public showQrModal = false;

  public dictionary: any = {
    FR: { title: 'Connexion', placeholderEmail: 'Email', placeholderPass: 'Mot de passe', btnContinue: 'Connexion', or: 'ou', google: 'Continuer avec Google', apple: 'Continuer avec Apple', qrCode: 'Connexion par QR', legal: 'Vous acceptez nos conditions.', qrTitle: 'Scanner le QR', qrDesc: 'Utilisez votre téléphone pour scanner ce code' },
    EN: { title: 'Login', placeholderEmail: 'Email', placeholderPass: 'Password', btnContinue: 'Login', or: 'or', google: 'Continue with Google', apple: 'Continue with Apple', qrCode: 'QR Code Login', legal: 'By continuing, you agree.', qrTitle: 'Scan QR', qrDesc: 'Use your phone to scan' },
    // (AR et ES conservés avec les mêmes clés pour éviter les erreurs de template)
    AR: { title: 'تسجيل الدخول', placeholderEmail: 'البريد الإلكتروني', placeholderPass: 'كلمة السر', btnContinue: 'دخول', or: 'أو', google: 'المتابعة بواسطة Google', apple: 'المتابعة بواسطة Apple', qrCode: 'تسجيل الدخول عبر رمز QR', legal: 'بمتابعتك، فإنك توافق.', qrTitle: 'امسح رمز QR', qrDesc: 'استخدم هاتفك لمسح الرمز' },
    ES: { title: 'Iniciar sesión', placeholderEmail: 'Correo', placeholderPass: 'Contraseña', btnContinue: 'Entrar', or: 'o', google: 'Continuar con Google', apple: 'Continuar con Apple', qrCode: 'Inicio de sesión QR', legal: 'Al continuar, aceptas.', qrTitle: 'Escanear QR', qrDesc: 'Usa tu teléfono para escanear' }
  };

  public onSubmit(): void {
    this.auth.login(this.loginData).subscribe({
      next: (res: any) => {
        // Enregistrement du token conforme au backend
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Erreur authentification:', err)
    });
  }

  public changeLangViaDropdown(lang: 'FR' | 'AR' | 'EN' | 'ES'): void {
    this.currentLang = lang;
    this.api.setLanguage(lang.toLowerCase() as any);
    this.dropdownOpen = false;
  }

  public toggleQrModal(status: boolean): void {
    this.showQrModal = status;
  }
}
