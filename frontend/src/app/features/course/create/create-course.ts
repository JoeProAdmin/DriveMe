import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-course.html'
})
export class CreateCourse implements OnInit, OnDestroy {
  private router = inject(Router);
  private api = inject(ApiService);

  public formModel = { adresseDepart: '', adresseArrivee: '', prix: null as number | null };
  private map: any;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (typeof window !== 'undefined' && (window as any).L) {
      const L = (window as any).L;
      this.map = L.map('driveme-live-map', { zoomControl: false }).setView([31.6295, -7.9811], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(this.map);
    }
  }

  public onFindDriver(): void {
    if (!this.formModel.adresseDepart || !this.formModel.adresseArrivee || !this.formModel.prix) return;

    // Appel au service corrigé
    this.api.requestCourse(this.formModel).subscribe({
      next: () => this.router.navigate(['/negotiation']),
      error: (err: any) => console.error('Erreur soumission course:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}
