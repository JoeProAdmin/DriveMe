import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import {
  ApiService,
  CategorieService,
  CourseCreateDTO
} from '../../../core/api.service';

type PointKind = 'departure' | 'arrival';

interface GeoPoint {
  latitude: number;
  longitude: number;
  label: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface RouteSummary {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][];
  source: 'OSRM' | 'ESTIMATION';
}

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-course.html',
  styleUrls: ['./create-course.css']
})
export class CreateCourse implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  public readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly zone = inject(NgZone);

  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org';
  private readonly osrmUrl = 'https://router.project-osrm.org/route/v1/driving';
  private readonly defaultCenter: [number, number] = [31.6295, -7.9811];
  private readonly minimumPrice = 15;
  private readonly basePrice = 8;
  private readonly pricePerKm = 3.5;

  public formModel = {
    adresseDepart: '',
    adresseArrivee: '',
    prix: null as number | null,
    categorieService: 'TOUS_SERVICES' as CategorieService,
    nombrePassagers: 1,
    dateHeureDepart: '',
    bagagesImportants: false,
    vehiculeAdapte: false
  };

  public minimumDepartureDateTime = '';

  public departureResults: GeoPoint[] = [];
  public arrivalResults: GeoPoint[] = [];
  public departurePoint: GeoPoint | null = null;
  public arrivalPoint: GeoPoint | null = null;
  public distanceKm: number | null = null;
  public durationMinutes: number | null = null;
  public estimatedPrice: number | null = null;
  public routeSource: 'OSRM' | 'ESTIMATION' | null = null;
  public activePointKind: PointKind = 'departure';

  public loading = false;
  public locating = false;
  public searchingDeparture = false;
  public searchingArrival = false;
  public calculatingRoute = false;
  public errorMessage = '';
  public successMessage = '';

  private map: any = null;
  private L: any = null;
  private departureMarker: any = null;
  private arrivalMarker: any = null;
  private routeLayer: any = null;

  ngOnInit(): void {
    this.minimumDepartureDateTime = this.toLocalDateTimeInputValue(new Date());
    this.restorePendingRide();
    setTimeout(() => this.initMap(), 100);
  }

  private restorePendingRide(): void {
    const rawDraft = sessionStorage.getItem('drivemePendingRide');
    if (!rawDraft) return;

    try {
      const draft = JSON.parse(rawDraft);
      this.formModel.adresseDepart = String(draft.departure || '');
      this.formModel.adresseArrivee = String(draft.destination || '');
      if (draft.departureCoordinates?.latitude != null && draft.departureCoordinates?.longitude != null) {
        this.departurePoint = {
          latitude: Number(draft.departureCoordinates.latitude),
          longitude: Number(draft.departureCoordinates.longitude),
          label: this.formModel.adresseDepart
        };
      }
      sessionStorage.removeItem('drivemePendingRide');
    } catch {
      sessionStorage.removeItem('drivemePendingRide');
    }
  }

  private initMap(): void {
    if (typeof window === 'undefined') return;

    this.L = (window as any).L;
    const mapElement = document.getElementById('driveme-live-map');

    if (!this.L || !mapElement) {
      this.errorMessage = 'La carte n’a pas pu être chargée. Vérifiez votre connexion internet.';
      return;
    }

    this.map = this.L.map(mapElement, { zoomControl: true }).setView(this.defaultCenter, 12);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.map.on('click', (event: any) => {
      this.zone.run(() => this.selectPointFromMap(event.latlng.lat, event.latlng.lng));
    });

    if (this.departurePoint) {
      this.updateMarker('departure', this.departurePoint);
      this.map.setView([this.departurePoint.latitude, this.departurePoint.longitude], 14);
    }

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  public setActivePoint(kind: PointKind): void {
    this.activePointKind = kind;
  }

  public searchAddress(kind: PointKind): void {
    const query = kind === 'departure'
      ? this.formModel.adresseDepart.trim()
      : this.formModel.adresseArrivee.trim();

    if (query.length < 3) {
      this.errorMessage = 'Saisissez au moins 3 caractères pour rechercher une adresse.';
      return;
    }

    this.errorMessage = '';
    this.setSearching(kind, true);

    const params = new HttpParams()
      .set('format', 'jsonv2')
      .set('q', query)
      .set('limit', '5')
      .set('addressdetails', '1')
      .set('accept-language', 'fr');

    this.http.get<NominatimResult[]>(`${this.nominatimUrl}/search`, { params }).pipe(
      map(results => results.map(result => ({
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        label: result.display_name
      }))),
      catchError(() => {
        this.errorMessage = 'La recherche d’adresse est momentanément indisponible.';
        return of([] as GeoPoint[]);
      })
    ).subscribe(results => {
      if (kind === 'departure') this.departureResults = results;
      else this.arrivalResults = results;
      this.setSearching(kind, false);
    });
  }

  public chooseAddress(kind: PointKind, point: GeoPoint): void {
    if (kind === 'departure') {
      this.departurePoint = point;
      this.formModel.adresseDepart = point.label;
      this.departureResults = [];
    } else {
      this.arrivalPoint = point;
      this.formModel.adresseArrivee = point.label;
      this.arrivalResults = [];
    }

    this.updateMarker(kind, point);
    this.focusOnPoints();
    this.recalculateRouteIfReady();
  }

  public useMyLocation(): void {
    this.locating = true;
    this.errorMessage = '';
    this.activePointKind = 'departure';

    if (!navigator.geolocation) {
      this.errorMessage = 'La géolocalisation n’est pas disponible sur ce navigateur.';
      this.locating = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        this.reverseGeocode(latitude, longitude).subscribe(label => {
          const point: GeoPoint = { latitude, longitude, label };
          this.chooseAddress('departure', point);
          this.locating = false;
        });
      },
      error => {
        this.locating = false;
        this.errorMessage = error.code === error.PERMISSION_DENIED
          ? 'Autorisation de localisation refusée.'
          : 'Votre position n’a pas pu être déterminée.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  public useEstimatedPrice(): void {
    if (this.estimatedPrice !== null) this.formModel.prix = this.estimatedPrice;
  }

  public onFindDriver(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.departurePoint || !this.arrivalPoint) {
      this.errorMessage = 'Sélectionnez un départ et une destination valides sur la carte.';
      return;
    }

    if (!this.formModel.prix || this.formModel.prix < this.minimumPrice) {
      this.errorMessage = `Le prix proposé doit être au minimum de ${this.minimumPrice} MAD.`;
      return;
    }

    if (!Number.isInteger(Number(this.formModel.nombrePassagers))
      || this.formModel.nombrePassagers < 1
      || this.formModel.nombrePassagers > 50) {
      this.errorMessage = this.api.t('course.invalidPassengerCount');
      return;
    }

    if (!this.formModel.dateHeureDepart) {
      this.errorMessage = this.api.t('course.missingDepartureDate');
      return;
    }

    const departureDate = new Date(this.formModel.dateHeureDepart);
    if (Number.isNaN(departureDate.getTime()) || departureDate.getTime() < Date.now()) {
      this.errorMessage = this.api.t('course.pastDepartureDate');
      return;
    }

    this.loading = true;

    const payload: CourseCreateDTO = {
          adresseDepart: this.formModel.adresseDepart.trim(),
          adresseArrivee: this.formModel.adresseArrivee.trim(),
          prix: Number(this.formModel.prix),
          latitudeDepart: this.departurePoint!.latitude,
          longitudeDepart: this.departurePoint!.longitude,
          latitudeArrivee: this.arrivalPoint!.latitude,
          longitudeArrivee: this.arrivalPoint!.longitude,
          distanceKm: this.distanceKm,
          dureeEstimeeMinutes: this.durationMinutes,
          prixEstime: this.estimatedPrice,
          categorieService: this.formModel.categorieService,
          nombrePassagers: Number(this.formModel.nombrePassagers),
          dateHeureDepart: this.formModel.dateHeureDepart,
          bagagesImportants: this.formModel.bagagesImportants,
          vehiculeAdapte: this.formModel.vehiculeAdapte
    };

    this.api.requestCourse(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Course créée avec succès.';
        setTimeout(() => this.router.navigate(['/courses']), 500);
      },
      error: (error: any) => {
        console.error('Erreur création course :', error);
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Erreur lors de la création de la course.';
      }
    });
  }

  public goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  private selectPointFromMap(latitude: number, longitude: number): void {
    this.reverseGeocode(latitude, longitude).subscribe(label => {
      this.chooseAddress(this.activePointKind, { latitude, longitude, label });
      this.activePointKind = this.activePointKind === 'departure' ? 'arrival' : 'departure';
    });
  }

  private reverseGeocode(latitude: number, longitude: number) {
    const params = new HttpParams()
      .set('format', 'jsonv2')
      .set('lat', String(latitude))
      .set('lon', String(longitude))
      .set('accept-language', 'fr');

    return this.http.get<{ display_name?: string }>(`${this.nominatimUrl}/reverse`, { params }).pipe(
      map(result => result.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`),
      catchError(() => of(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`))
    );
  }

  private recalculateRouteIfReady(): void {
    if (!this.departurePoint || !this.arrivalPoint) {
      this.clearRouteSummary();
      return;
    }

    this.calculatingRoute = true;
    const departure = this.departurePoint;
    const arrival = this.arrivalPoint;
    const coordinates = `${departure.longitude},${departure.latitude};${arrival.longitude},${arrival.latitude}`;
    const params = new HttpParams()
      .set('overview', 'full')
      .set('geometries', 'geojson')
      .set('steps', 'false');

    this.http.get<any>(`${this.osrmUrl}/${coordinates}`, { params }).pipe(
      map(response => {
        const route = response?.routes?.[0];
        if (!route) throw new Error('Route indisponible');
        return {
          distanceKm: route.distance / 1000,
          durationMinutes: route.duration / 60,
          coordinates: route.geometry.coordinates.map((coordinate: number[]) => [coordinate[1], coordinate[0]]),
          source: 'OSRM' as const
        } satisfies RouteSummary;
      }),
      catchError(() => of(this.buildFallbackRoute(departure, arrival)))
    ).subscribe(summary => {
      this.distanceKm = this.round(summary.distanceKm, 1);
      this.durationMinutes = Math.max(1, Math.round(summary.durationMinutes));
      this.estimatedPrice = Math.max(
        this.minimumPrice,
        Math.round(this.basePrice + summary.distanceKm * this.pricePerKm)
      );
      this.routeSource = summary.source;
      if (!this.formModel.prix) this.formModel.prix = this.estimatedPrice;
      this.drawRoute(summary.coordinates);
      this.calculatingRoute = false;
    });
  }

  private buildFallbackRoute(departure: GeoPoint, arrival: GeoPoint): RouteSummary {
    const straightDistance = this.haversineDistance(departure, arrival);
    const roadDistance = straightDistance * 1.25;
    return {
      distanceKm: roadDistance,
      durationMinutes: (roadDistance / 28) * 60,
      coordinates: [
        [departure.latitude, departure.longitude],
        [arrival.latitude, arrival.longitude]
      ],
      source: 'ESTIMATION'
    };
  }

  private updateMarker(kind: PointKind, point: GeoPoint): void {
    if (!this.map || !this.L) return;

    const marker = this.L.marker([point.latitude, point.longitude], {
      title: kind === 'departure' ? 'Départ' : 'Destination'
    }).addTo(this.map).bindPopup(
      `<strong>${kind === 'departure' ? 'Départ' : 'Destination'}</strong><br>${this.escapeHtml(point.label)}`
    );

    if (kind === 'departure') {
      this.departureMarker?.remove();
      this.departureMarker = marker;
    } else {
      this.arrivalMarker?.remove();
      this.arrivalMarker = marker;
    }
  }

  private drawRoute(coordinates: [number, number][]): void {
    if (!this.map || !this.L) return;
    this.routeLayer?.remove();
    this.routeLayer = this.L.polyline(coordinates, { weight: 6, opacity: 0.85 }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [40, 40] });
  }

  private focusOnPoints(): void {
    if (!this.map || !this.L) return;
    const points = [this.departurePoint, this.arrivalPoint].filter(Boolean) as GeoPoint[];
    if (points.length === 1) {
      this.map.setView([points[0].latitude, points[0].longitude], 15);
    } else if (points.length === 2) {
      this.map.fitBounds(this.L.latLngBounds(points.map(point => [point.latitude, point.longitude])), {
        padding: [40, 40]
      });
    }
  }

  private clearRouteSummary(): void {
    this.distanceKm = null;
    this.durationMinutes = null;
    this.estimatedPrice = null;
    this.routeSource = null;
    this.routeLayer?.remove();
    this.routeLayer = null;
  }

  private setSearching(kind: PointKind, value: boolean): void {
    if (kind === 'departure') this.searchingDeparture = value;
    else this.searchingArrival = value;
  }

  private haversineDistance(first: GeoPoint, second: GeoPoint): number {
    const earthRadiusKm = 6371;
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const latitudeDelta = toRadians(second.latitude - first.latitude);
    const longitudeDelta = toRadians(second.longitude - first.longitude);
    const a = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(toRadians(first.latitude))
      * Math.cos(toRadians(second.latitude))
      * Math.sin(longitudeDelta / 2) ** 2;
    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private round(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }

  public serviceLabel(category: CategorieService): string {
    const keys: Record<CategorieService, string> = {
      TOUS_SERVICES: 'course.serviceAll',
      TAXI_OFFICIEL: 'course.serviceTaxi',
      TRANSPORTEUR_TOURISTIQUE: 'course.serviceTourist',
      CHAUFFEUR_PRIVE: 'course.servicePrivate'
    };
    return this.api.t(keys[category]);
  }

  private toLocalDateTimeInputValue(date: Date): string {
    const offsetMilliseconds = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offsetMilliseconds).toISOString().slice(0, 16);
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    })[character] || character);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
