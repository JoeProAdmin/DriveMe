import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-course.html',
  styleUrls: ['./create-course.css']
})
export class CreateCourse implements OnInit, OnDestroy {

  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  public formModel = {
    adresseDepart: '',
    adresseArrivee: '',
    prix: null as number | null
  };

  public loading = false;
  public locating = false;
  public errorMessage = '';
  public successMessage = '';

  private map: any = null;
  private L: any = null;

  ngOnInit(): void {
    setTimeout(() => this.initMap(), 200);
  }

  private initMap(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.L = (window as any).L;

    if (!this.L) {
      console.warn('Leaflet non chargé. Affichage carte simulée uniquement.');
      return;
    }

    const mapElement = document.getElementById('driveme-live-map');

    if (!mapElement) {
      console.error('Élément carte introuvable : driveme-live-map');
      return;
    }

    this.map = this.L.map('driveme-live-map', {
      zoomControl: false
    }).setView([31.6295, -7.9811], 12);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(this.map);

    this.L.circleMarker([31.6295, -7.9811], {
      radius: 9,
      color: '#0f172a',
      fillColor: '#00C853',
      fillOpacity: 1
    }).addTo(this.map).bindPopup('Marrakech - zone DriveMe');
  }

  public useMyLocation(): void {
    this.locating = true;
    this.errorMessage = '';

    if (!navigator.geolocation) {
      this.errorMessage = 'La géolocalisation n’est pas disponible sur ce navigateur.';
      this.locating = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        this.formModel.adresseDepart = 'Ma position actuelle';

        if (this.map && this.L) {
          this.map.setView([latitude, longitude], 14);

          this.L.circleMarker([latitude, longitude], {
            radius: 10,
            color: '#0f172a',
            fillColor: '#0288D1',
            fillOpacity: 1
          }).addTo(this.map).bindPopup('Votre position actuelle').openPopup();
        }

        this.locating = false;
      },
      () => {
        this.errorMessage = 'Autorisation de localisation refusée.';
        this.locating = false;
      }
    );
  }

  public onFindDriver(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formModel.adresseDepart || !this.formModel.adresseArrivee || !this.formModel.prix) {
      this.errorMessage = 'Veuillez compléter le départ, la destination et le prix proposé.';
      return;
    }

    const email = localStorage.getItem('userEmail');

    if (!email) {
      this.errorMessage = 'Session utilisateur introuvable. Veuillez vous reconnecter.';
      return;
    }

    this.loading = true;

    this.api.getAllPassagers().subscribe({
      next: (passagers: any[]) => {
        const passager = passagers.find((p: any) => p.email === email);

        if (!passager) {
          this.loading = false;
          this.errorMessage = 'Profil passager introuvable pour cet utilisateur.';
          return;
        }

        const payload = {
          passagerId: passager.id,
          chauffeurId: 1,
          adresseDepart: this.formModel.adresseDepart.trim(),
          adresseArrivee: this.formModel.adresseArrivee.trim(),
          prix: this.formModel.prix
        };

        this.api.requestCourse(payload).subscribe({
          next: () => {
            this.loading = false;
            this.successMessage = 'Course créée avec succès.';
            this.router.navigate(['/courses']);
          },
          error: (error: any) => {
            console.error('Erreur création course :', error);
            this.loading = false;
            this.errorMessage = 'Erreur lors de la création de la course.';
          }
        });
      },
      error: (error: any) => {
        console.error('Erreur récupération passagers :', error);
        this.loading = false;
        this.errorMessage = 'Impossible de récupérer le profil passager.';
      }
    });
  }

  public goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
