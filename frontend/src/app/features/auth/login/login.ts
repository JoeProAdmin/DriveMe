import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { HeaderComponent } from '../../../shared/layout/header/header';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  public readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  public loginData = { identifiant: '', motDePasse: '' };
  public dropdownOpen = false;
  public showQrModal = false;
  public isSubmitting = false;
  public errorMessage = '';
  public informationMessage = '';
  public showPassword = false;

  public readonly dictionary: Record<string, any> = {
    FR: { title: 'Connexion à DriveMe', identifier: 'Téléphone ou email', password: 'Mot de passe', submit: 'Se connecter', loading: 'Connexion...', register: 'Créer un compte', forgot: 'Mot de passe oublié ?', or: 'ou', google: 'Continuer avec Google', apple: 'Continuer avec Apple', qr: 'Connexion par QR', legal: 'Google, Apple et QR sont présentés comme parcours futurs. La connexion par téléphone/email et mot de passe est pleinement fonctionnelle.' },
    EN: { title: 'Sign in to DriveMe', identifier: 'Phone or email', password: 'Password', submit: 'Sign in', loading: 'Signing in...', register: 'Create account', forgot: 'Forgot password?', or: 'or', google: 'Continue with Google', apple: 'Continue with Apple', qr: 'Sign in with QR', legal: 'Google, Apple and QR are presented as future flows. Phone/email and password sign-in is fully functional.' },
    AR: { title: 'تسجيل الدخول إلى DriveMe', identifier: 'الهاتف أو البريد الإلكتروني', password: 'كلمة المرور', submit: 'تسجيل الدخول', loading: 'جاري الدخول...', register: 'إنشاء حساب', forgot: 'نسيت كلمة المرور؟', or: 'أو', google: 'المتابعة مع Google', apple: 'المتابعة مع Apple', qr: 'الدخول عبر QR', legal: 'يتم عرض Google وApple وQR كمسارات مستقبلية. تسجيل الدخول بالهاتف/البريد وكلمة المرور يعمل بالكامل.' },
    ES: { title: 'Iniciar sesión en DriveMe', identifier: 'Teléfono o email', password: 'Contraseña', submit: 'Iniciar sesión', loading: 'Conectando...', register: 'Crear una cuenta', forgot: '¿Olvidó su contraseña?', or: 'o', google: 'Continuar con Google', apple: 'Continuar con Apple', qr: 'Conexión por QR', legal: 'Google, Apple y QR se presentan como flujos futuros. El acceso por teléfono/email y contraseña funciona completamente.' }
  };

  public get currentLang(): 'FR' | 'AR' | 'EN' | 'ES' {
    return this.api.currentLanguage().toUpperCase() as 'FR' | 'AR' | 'EN' | 'ES';
  }

  public onSubmit(): void {
    this.errorMessage = '';
    this.informationMessage = '';
    if (!this.loginData.identifiant.trim() || !this.loginData.motDePasse) {
      this.errorMessage = 'Veuillez saisir votre identifiant et votre mot de passe.';
      return;
    }
    this.isSubmitting = true;
    this.api.login({ identifiant: this.loginData.identifiant.trim(), motDePasse: this.loginData.motDePasse }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        const role = this.storeSession(res.token);
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        this.router.navigate([redirect === 'create-course' && role === 'PASSAGER' ? '/create-course' : '/dashboard']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Connexion impossible. Vérifiez vos identifiants.';
        this.cdr.markForCheck();
      }
    });
  }


  private storeSession(token: string): string {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', payload.role);
    localStorage.setItem('userEmail', payload.sub);
    return payload.role;
  }

  public changeLangViaDropdown(lang: 'FR' | 'AR' | 'EN' | 'ES'): void {
    this.api.setLanguage(lang.toLowerCase() as 'fr' | 'ar' | 'en' | 'es');
    this.dropdownOpen = false;
  }
}
