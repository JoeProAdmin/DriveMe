import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  public registerModel = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    role: 'PASSAGER' as 'PASSAGER' | 'CHAUFFEUR'
  };

  public isSubmitting: boolean = false;
  public errorMessage: string = '';
  public successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    public apiService: ApiService
  ) {}

  public executerInscription(): void {
    if (!this.registerModel.nom || !this.registerModel.prenom || !this.registerModel.telephone) {
      this.errorMessage = 'Les champs obligatoires doivent être renseignés.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Appel direct vers l'API de ton Backend Spring Security
    this.http.post(`${localStorage.getItem('apiUrl') || 'http://localhost:8080/api'}/auth/register`, this.registerModel)
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Compte DriveMe créé avec succès ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = "Échec de l'inscription. Ce numéro de téléphone est probablement déjà utilisé.";
          this.isSubmitting = false;
        }
      });
  }
}
