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
  public credentials = {
    email: '',
    motDePasse: ''
  };

  public isSubmitting: boolean = false;
  public errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  public executerConnexion(): void {
    if (!this.credentials.email || !this.credentials.motDePasse) {
      this.errorMessage = 'Veuillez renseigner vos identifiants.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.apiService.login(this.credentials).subscribe({
      next: (session) => {
        this.isSubmitting = false;
        const role = localStorage.getItem('userRole');

        // Routage adaptatif selon les privilèges du compte
        if (role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/courses/list']);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Email ou mot de passe incorrect.';
        this.isSubmitting = false;
      }
    });
  }
}
