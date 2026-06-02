import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['../register.css']
})
export class LoginComponent {
  public credentials = { email: '', motDePasse: '' };
  public isSubmitting: boolean = false;
  public errorMessage: string = '';

  constructor(
    public apiService: ApiService,
    private router: Router
  ) {}

  public executerConnexion(): void {
    if (!this.credentials.email || !this.credentials.motDePasse) {
      this.errorMessage = 'Veuillez remplir vos identifiants.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.apiService.login(this.credentials).subscribe({
      next: (session) => {
        this.isSubmitting = false;
        this.procederRoutage(localStorage.getItem('userRole') || 'PASSAGER');
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Identifiants incorrects ou problème de connexion au serveur.';
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Permet au jury ou à toi-même de tester les écrans immédiatement sans blocage réseau
   */
  public bypassRoute(roleSimule: 'ADMIN' | 'PASSAGER'): void {
    localStorage.setItem('userRole', roleSimule);
    localStorage.setItem('token', 'simulated-jwt-token-2026');
    this.procederRoutage(roleSimule);
  }

  private procederRoutage(role: string): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/create-course']);
    }
  }
}
