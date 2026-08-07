import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, SosIncidentDTO, SosStatus } from '../../core/api.service';

type EmergencyType = 'Accident' | 'Agression' | 'Harcèlement' | 'Problème médical' | 'Véhicule en panne' | 'Autre';

@Component({
  selector: 'app-sos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sos.html',
  styleUrls: ['./sos.css']
})
export class SosComponent implements OnInit {
  userEmail = localStorage.getItem('userEmail') || 'Utilisateur non identifié';
  userRole = (localStorage.getItem('userRole') || '').replace('ROLE_', '');
  selectedType: EmergencyType = 'Accident';
  description = '';
  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;
  locating = false;
  sending = false;
  loading = false;
  alertSent = false;
  errorMessage = '';
  incidentHistory: SosIncidentDTO[] = [];
  readonly statuses: SosStatus[] = ['NOUVEAU', 'PRIS_EN_CHARGE', 'RESOLU', 'CLOTURE'];
  readonly emergencyTypes: EmergencyType[] = ['Accident', 'Agression', 'Harcèlement', 'Problème médical', 'Véhicule en panne', 'Autre'];

  constructor(
    public readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  get isAdmin(): boolean { return this.userRole === 'ADMIN'; }

  ngOnInit(): void { this.loadIncidents(); }

  detectLocation(): void {
    this.errorMessage = '';
    this.locating = true;
    if (!navigator.geolocation) {
      this.locationFailed('La géolocalisation n’est pas disponible sur cet appareil.');
      return;
    }
    this.requestPosition(true, 15000, () => this.requestPosition(false, 10000, () =>
      this.locationFailed('Position introuvable après deux tentatives. Vérifiez les autorisations de localisation, puis réessayez.')));
  }

  private requestPosition(highAccuracy: boolean, timeout: number, onFailure: () => void): void {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
        this.locating = false;
        this.cdr.markForCheck();
      },
      () => onFailure(),
      { enableHighAccuracy: highAccuracy, timeout, maximumAge: highAccuracy ? 0 : 60000 }
    );
  }

  private locationFailed(message: string): void {
    this.locating = false;
    this.errorMessage = message;
    this.cdr.markForCheck();
  }

  sendAlert(): void {
    this.errorMessage = '';
    this.alertSent = false;
    if (!this.description.trim()) {
      this.errorMessage = 'Décrivez brièvement la situation avant l’envoi.';
      return;
    }
    if (!window.confirm('Confirmez-vous l’envoi de cette alerte SOS à DriveMe ? En cas de danger immédiat, contactez aussi les services d’urgence.')) return;

    this.sending = true;
    this.apiService.createSosIncident({
      type: this.selectedType,
      description: this.description.trim(),
      latitude: this.latitude,
      longitude: this.longitude,
      precisionMetres: this.accuracy
    }).pipe(finalize(() => {
      this.sending = false;
      this.cdr.markForCheck();
    })).subscribe({
      next: () => {
        this.alertSent = true;
        this.description = '';
        this.loadIncidents();
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'L’alerte n’a pas pu être transmise. Vérifiez votre connexion et réessayez immédiatement.';
        this.cdr.markForCheck();
      }
    });
  }

  updateStatus(incident: SosIncidentDTO, status: SosStatus): void {
    this.apiService.updateSosStatus(incident.id, status).subscribe({
      next: updated => {
        this.incidentHistory = this.incidentHistory.map(item => item.id === updated.id ? updated : item);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Le statut de l’incident n’a pas pu être mis à jour.';
        this.cdr.markForCheck();
      }
    });
  }

  openMap(incident: SosIncidentDTO): void {
    if (incident.latitude !== null && incident.longitude !== null) {
      window.open(`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`, '_blank', 'noopener');
    }
  }

  callPolice(): void { window.location.href = 'tel:19'; }
  callGendarmerie(): void { window.location.href = 'tel:177'; }
  callAmbulance(): void { window.location.href = 'tel:15'; }

  private loadIncidents(): void {
    this.loading = true;
    const request = this.isAdmin ? this.apiService.getAllSosIncidents() : this.apiService.getMySosIncidents();
    request.pipe(finalize(() => {
      this.loading = false;
      this.cdr.markForCheck();
    })).subscribe({
      next: incidents => {
        this.incidentHistory = incidents;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les incidents SOS.';
        this.cdr.markForCheck();
      }
    });
  }
}
