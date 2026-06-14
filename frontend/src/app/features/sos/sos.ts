import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type EmergencyType =
  | 'Accident'
  | 'Agression'
  | 'Harcèlement'
  | 'Problème médical'
  | 'Véhicule en panne'
  | 'Autre';

interface LocalIncident {
  id: number;
  userEmail: string;
  userRole: string;
  type: EmergencyType;
  description: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  status: string;
}

@Component({
  selector: 'app-sos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sos.html',
  styleUrls: ['./sos.css']
})
export class SosComponent {

  userEmail = localStorage.getItem('userEmail') || 'Utilisateur non identifié';
  userRole = localStorage.getItem('userRole') || 'VISITEUR';

  selectedType: EmergencyType = 'Accident';
  description = '';

  latitude: number | null = null;
  longitude: number | null = null;

  locating = false;
  alertSent = false;
  errorMessage = '';

  incidentHistory: LocalIncident[] = [];

  emergencyTypes: EmergencyType[] = [
    'Accident',
    'Agression',
    'Harcèlement',
    'Problème médical',
    'Véhicule en panne',
    'Autre'
  ];

  constructor() {
    this.loadIncidentHistory();
  }

  detectLocation(): void {
    this.errorMessage = '';
    this.locating = true;

    if (!navigator.geolocation) {
      this.errorMessage = 'La géolocalisation n’est pas disponible sur ce navigateur.';
      this.locating = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.locating = false;
      },
      () => {
        this.errorMessage = 'Impossible de récupérer la position. Vérifiez l’autorisation GPS du navigateur.';
        this.locating = false;
      }
    );
  }

  sendAlert(): void {
    this.errorMessage = '';
    this.alertSent = false;

    const confirmed = window.confirm(
      'Confirmez-vous l’envoi d’une alerte SOS à la plateforme DriveMe ? En cas de danger immédiat, contactez aussi les services d’urgence locaux.'
    );

    if (!confirmed) {
      return;
    }

    const incident: LocalIncident = {
      id: Date.now(),
      userEmail: this.userEmail,
      userRole: this.userRole,
      type: this.selectedType,
      description: this.description.trim() || 'Aucune description fournie',
      latitude: this.latitude,
      longitude: this.longitude,
      createdAt: new Date().toISOString(),
      status: 'ENREGISTRE_LOCAL'
    };

    this.incidentHistory = [
      incident,
      ...this.incidentHistory
    ];

    localStorage.setItem(
      'driveme_sos_incidents',
      JSON.stringify(this.incidentHistory)
    );

    this.alertSent = true;
    this.description = '';
  }

  callPolice(): void {
    window.location.href = 'tel:19';
  }

  callGendarmerie(): void {
    window.location.href = 'tel:177';
  }

  callAmbulance(): void {
    window.location.href = 'tel:15';
  }

  private loadIncidentHistory(): void {
    const raw = localStorage.getItem('driveme_sos_incidents');

    if (!raw) {
      this.incidentHistory = [];
      return;
    }

    try {
      this.incidentHistory = JSON.parse(raw);
    } catch {
      this.incidentHistory = [];
    }
  }
}
