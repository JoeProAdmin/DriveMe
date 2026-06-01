import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  message: string = '';

  constructor(private api: ApiService) {}

  createCourse() {
    const data = {
      passagerId: 4,
      chauffeurId: 2,
      adresseDepart: this.adresseDepart,
      adresseArrivee: this.adresseArrivee,
      prix: this.prix
    };

    this.api.createCourse(data).subscribe({
      next: (res) => {
        console.log('COURSE CREATED:', res);
        this.message = 'Course créée avec succès';

        this.adresseDepart = '';
        this.adresseArrivee = '';
        this.prix = 0;
      },
      error: (err) => {
        console.error('BACK ERROR:', err);
        this.message = 'Erreur lors de la création';
      }
    });
  }
}
