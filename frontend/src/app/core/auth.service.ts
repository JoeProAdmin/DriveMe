import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <input [(ngModel)]="credentials.email" type="email" placeholder="Email">
      <input [(ngModel)]="credentials.password" type="password" placeholder="Mot de passe">
      <button (click)="onLogin()">Se connecter</button>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  public credentials = { email: '', password: '' };

  public onLogin(): void {
    this.auth.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error('Erreur de connexion', err)
    });
  }
}
