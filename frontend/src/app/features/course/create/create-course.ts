import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-course.html',
  styleUrls: ['./create-course.css']
})
export class CreateCourse implements OnInit {

  // Modèle de formulaire aligné sur CourseCreateDTO.java
  public formModel = {
    passagerId: 1, // Id extrait par défaut ou depuis la session locale
    chauffeurId: 2, // Id du chauffeur sélectionné par le dispatcher/algorithme
    adresseDepart: '',
    adresseArrivee: '',
    prix: 0
  };

  public isSubmitting: boolean = false;
  public successMessage: string = '';
  public errorMessage: string = '';

  constructor(
    public apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupération dynamique de l'ID du passager stocké lors du login si disponible
    const localId = localStorage.getItem('userId');
    if (localId) {
      this.formModel.passagerId = +localId;
    }
  }

  /**
   * Calcule une estimation du prix de la course basée sur la distance théorique
   */
  public estimerPrix(): void {
    const longueurSource = this.formModel.adresseDepart.length;
    const longueurCible = this.formModel.adresseArrivee.length;

    if (longueurSource > 3 && longueurCible > 3) {
      // Formule d'estimation déterministe pour le TFE (Tarif de base + facteur longueur)
      this.formModel.prix = 15 + (longueurSource + longueurCible) * 1.5;
    } else {
      this.formModel.prix = 0;
    }
  }

  /**
   * Soumission du payload DTO valide vers ton CourseController.java
   */
  public commanderCourse(): void {
    if (!this.formModel.adresseDepart || !this.formModel.adresseArrivee || this.formModel.prix === 0) {
      this.errorMessage = 'Veuillez renseigner des adresses valides pour calculer une estimation.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.createCourse(this.formModel).subscribe({
      next: (response: any) => {
        this.successMessage = 'Votre demande de course a été enregistrée avec succès !';
        this.isSubmitting = false;

        // Redirection après un court délai vers le tableau de suivi des trajets
        setTimeout(() => {
          this.router.navigate(['/courses/list']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Erreur lors du dispatching de la course :', err);
        this.errorMessage = 'Le serveur a rejeté la requête. Vérifiez vos autorisations JWT.';
        this.isSubmitting = false;
      }
    });
  }
}
