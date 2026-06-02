import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

// Déclaration pour s'interfacer avec la bibliothèque cartographique globale
declare var L: any;

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-course.html',
  styleUrls: ['./create-course.css']
})
export class CreateCourse implements OnInit, AfterViewInit {

  public formModel = {
    passagerId: 1,
    chauffeurId: 2,
    adresseDepart: '',
    adresseArrivee: '',
    prix: 0
  };

  public isSubmitting = false;
  public successMessage = '';
  public errorMessage = '';
  private map: any;

  constructor(
    public apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const localId = localStorage.getItem('userId');
    if (localId) {
      this.formModel.passagerId = +localId;
    }
  }

  ngAfterViewInit(): void {
    this.initialiserCartographieMaroc();
  }

  /**
   * Initialise une vraie carte interactive centrée géographiquement sur le Maroc
   */
  private initialiserCartographieMaroc(): void {
    // Chargement dynamique du CSS de la carte si non présent
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Chargement dynamique du moteur de carte OpenStreetMap
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // Centrage géographique sur les coordonnées du Maroc (Rabat/Casablanca)
      this.map = L.map('driveme-live-map').setView([33.5731, -7.5898], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Ajout d'un marqueur de test animé sur l'axe central
      L.marker([33.5731, -7.5898]).addTo(this.map)
        .bindPopup('<b>Réseau DriveMe</b><br>Flotte de chauffeurs active.')
        .openPopup();
    };
    document.body.appendChild(script);
  }

  public estimerPrix(): void {
    const longueurSource = this.formModel.adresseDepart.length;
    const longueurCible = this.formModel.adresseArrivee.length;

    if (longueurSource > 3 && longueurCible > 3) {
      this.formModel.prix = 20 + (longueurSource + longueurCible) * 1.35;
    } else {
      this.formModel.prix = 0;
    }
  }

  public commanderCourse(): void {
    this.isSubmitting = true;
    this.apiService.createCourse(this.formModel).subscribe({
      next: () => {
        this.successMessage = 'Demande transmise aux chauffeurs à proximité !';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/courses']), 2000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la liaison au serveur de dispatching.';
        this.isSubmitting = false;
      }
    });
  }
}
