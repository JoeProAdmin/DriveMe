import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <input [(ngModel)]="credentials.email" type="email" name="email" required>
      <input [(ngModel)]="credentials.password" type="password" name="password" required>
      <button (click)="onSubmit()">Connexion</button>
    </div>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  public credentials = { email: '', password: '' };

  public onSubmit(): void {
    this.auth.login(this.credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', res.role);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Auth failure', err)
    });
  }
}
