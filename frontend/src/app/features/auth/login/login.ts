import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const data = {
      email: this.email,
      motDePasse: this.password
    };

    this.api.login(data).subscribe({
      next: (res) => {
        console.log('SUCCESS JWT:', res);

        localStorage.setItem('token', res.token);

        /*
         * Démonstration TFE :
         * Le compte passager1@driveme.com est lié au passager métier ID = 2.
         * Le dashboard charge les courses via /api/courses/passager/2.
         */
        localStorage.setItem('userId', '2');

        this.successMessage = 'Connexion réussie';

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('ERROR LOGIN:', err);
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
}
