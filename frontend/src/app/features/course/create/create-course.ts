import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';

declare var L: any;

interface OffreChauffeur {
  id: number;
  nom: string;
  vehicule: string;
  immatriculation: string;
  note: number;
  distance: string;
  tempsArrivee: number;
  prixPropose: number;
}

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-course.html',
  styleUrls: ['./create-course.css']
})
export class CreateCourse implements OnInit, AfterViewInit {
  // Modèle aligné sur ton CourseCreateDTO.java
  public formModel = {
    passagerId: 1,
    chauffeurId: 0,
    adresseDepart: '',
    adresseArrivee: '',
    prix: 0 // Le prix initial proposé par le passager
  };

  public isSearching: boolean = false;
  public offers: OffreChauffeur[] = [];
  public selectedChauffeur: OffreChauffeur | null = null;
  public courseStatus: 'CREATION' | 'NEGOCIATION' | 'EN_ROUTE' = 'CREATION';

  public successMessage: string = '';
  public errorMessage: string = '';
  private map: any;

  constructor(public apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const localId = localStorage.getItem('userId');
    if (localId) this.formModel.passagerId = +localId;
  }

  ngAfterViewInit(): void {
    this.initialiserCarteMaroc();
  }

  private initialiserCarteMaroc(): void {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // Centrage global Maroc (Coordonnées Marrakech/Casablanca)
      this.map = L.map('driveme-live-map').setView([31.6295, -7.9811], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    };
    document.body.appendChild(script);
  }

  /**
   * Étape 1 : Le passager publie sa demande à son prix (inDrive Style)
   */
  public publierDemande(): void {
    if (!this.formModel.adresseDepart || !this.formModel.adresseArrivee || this.formModel.prix <= 0) {
      this.errorMessage = 'Veuillez renseigner les adresses et votre proposition de prix.';
      return;
    }

    this.isSearching = true;
    this.courseStatus = 'NEGOCIATION';
    this.errorMessage = '';

    // Simulation d'algorithme de contre-propositions de chauffeurs marocains à proximité
    setTimeout(() => {
      this.offers = [
        { id: 101, nom: 'Mohcine', vehicule: 'Argenté Peugeot 206', immatriculation: '89637-6-د', note: 5, distance: '1.2 km', tempsArrivee: 3, prixPropose: this.formModel.prix },
        { id: 102, nom: 'Youssef', vehicule: 'Dacia Logan Blan', immatriculation: '12455-A-1', note: 4.8, distance: '2.5 km', tempsArrivee: 6, prixPropose: this.formModel.prix + 5 },
        { id: 103, nom: 'Karim', vehicule: 'Renault Clio Noir', immatriculation: '74839-B-6', note: 4.9, distance: '4.1 km', tempsArrivee: 9, prixPropose: this.formModel.prix - 2 }
      ];
      this.isSearching = false;
    }, 2500);
  }

  /**
   * Étape 2 : Le passager accepte manuellement le chauffeur de son choix
   */
  public accepterChauffeur(offre: OffreChauffeur): void {
    this.selectedChauffeur = offre;
    this.formModel.chauffeurId = offre.id;
    this.formModel.prix = offre.prixPropose; // Prix final négocié
    this.courseStatus = 'EN_ROUTE';

    // Persistance de la course dans ton CourseController.java via l'API
    this.apiService.createCourse(this.formModel).subscribe({
      next: (res) => {
        this.successMessage = `Course confirmée avec ${offre.nom}. Il arrive dans ${offre.tempsArrivee} min !`;
      },
      error: (err) => {
        this.errorMessage = "Erreur d'enregistrement de la course.";
      }
    });
  }

  /**
   * Sécurité : Bouton SOS d'urgence conforme à ton objectif de protection utilisateur
   */
  public declencherSOS(): void {
    alert(`🚨 ALERTE SOS ACTIVÉE 🚨\nVotre position GPS est partagée en direct avec les autorités et l'équipe DriveMe Sécurité.`);
  }
}
