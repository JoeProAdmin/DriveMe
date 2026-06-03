import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-course.html'
})
export class CreateCourseComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  // Modèle d'ingénierie chaîné avec le template HTML
  public formModel = {
    adresseDepart: '',
    adresseArrivee: '',
    prix: null as number | null
  };

  private map: any;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (typeof window === 'undefined') return;
    const L = (window as any).L;
    if (!L) return;

    // Rendu cartographique initialisé et centré sur Marrakech
    this.map = L.map('driveme-interactive-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([31.6295, -7.9811], 12);

    // Tuiles claires cartographiques professionnelles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(this.map);
  }

  public onFindDriver(): void {
    if (!this.formModel.adresseDepart || !this.formModel.adresseArrivee || !this.formModel.prix) return;

    // Transmission de la session et routage
    localStorage.setItem('pending_course_price', this.formModel.prix.toString());
    this.router.navigate(['/negotiation']);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}

// Assure l'alignement strict avec app.routes.ts ligne 5
export { CreateCourseComponent as CreateCourse };
