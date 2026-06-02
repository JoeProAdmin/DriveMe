import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-course.html',
  styleUrls: ['./create-course.css']
})
export class CreateCourse {

  adresseDepart: string = '';
  adresseArrivee: string = '';
  prix: number = 0;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  createCourse(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const data = {
      passagerId: 4,
      chauffeurId: 2,
      adresseDepart: this.adresseDepart,
      adresseArrivee: this.adresseArrivee,
      prix: this.prix
    };

    // Typage explicite des retours (any) pour valider la compilation stricte du compilateur
    this.api.createCourse(data).subscribe({
      next: (res: any) => {
        console.log('COURSE CREATED SUCCESSFULLY:', res);
        this.successMessage = 'Ordre de transit enregistré avec succès sur le réseau.';

        // Purge du formulaire après succès
        this.adresseDepart = '';
        this.adresseArrivee = '';
        this.prix = 0;

        // Redirection vers le registre d'exploitation après un léger délai de persistance
        setTimeout(() => {
          this.router.navigate(['/courses']);
        }, 1500);
      },
      error: (err: any) => {
        console.error('BACKEND ENDPOINT ERROR:', err);
        this.errorMessage = 'Impossible de générer l\'ordre de course. Vérifiez l\'état des passerelles API.';
      }
    });
  }
}
