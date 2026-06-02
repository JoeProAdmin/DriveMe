import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ChauffeurResponseDTO {
  id: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  statutValidation: string | number;
  noteMoyenne?: number;
  soldeCredit?: number;
}

export interface AdminStats {
  totalChauffeurs: number;
  totalPassagers: number;
  totalCourses: number;
  totalPaiements: number;
}

export interface UserSession {
  token: string;
  userId: string;
  role: 'ADMIN' | 'CHAUFFEUR' | 'PASSAGER';
}

export interface AvisDTO {
  id?: number;
  courseId: number;
  note: number;
  commentaire: string;
  dateCreation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  // Alignement du signal sur les quatre langues utilisées par les composants du projet
  public currentLanguage: WritableSignal<'fr' | 'en' | 'ar' | 'es'> = signal('fr');
  public currentCurrency: WritableSignal<'MAD' | '$' | '€'> = signal('MAD');
  public isRtlMode: WritableSignal<boolean> = signal(false);

  private authSubject = new BehaviorSubject<UserSession | null>(null);
  public auth$ = this.authSubject.asObservable();

  constructor(private http: HttpClient) {
    this.hydrateSession();
  }

  private hydrateSession(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole') as 'ADMIN' | 'CHAUFFEUR' | 'PASSAGER';

    if (token && userId && role) {
      this.authSubject.next({ token, userId, role });
    }
  }

  login(credentials: { email: string; motDePasse: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId || '1');
          localStorage.setItem('userRole', res.role || 'ADMIN');

          this.authSubject.next({
            token: res.token,
            userId: res.userId || '1',
            role: res.role || 'ADMIN'
          });
        }
      })
    );
  }

  /**
   * Fonctionnalité d'upload de selfie pour la validation réglementaire des chauffeurs
   */
  uploadSelfieVerification(chauffeurId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('selfie', file);
    return this.http.post<any>(`${this.baseUrl}/chauffeurs/${chauffeurId}/selfie`, formData);
  }

  /**
   * Envoi d'une notation et d'un avis suite à une course
   */
  soumettreAvis(avis: AvisDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/avis`, avis);
  }

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/admin/stats`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/courses`, courseData);
  }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  }

  getAllChauffeurs(): Observable<ChauffeurResponseDTO[]> {
    return this.http.get<ChauffeurResponseDTO[]>(`${this.baseUrl}/chauffeurs`);
  }

  validerChauffeur(id: number, statutByte: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/chauffeurs/${id}/validation?statut=${statutByte}`, {});
  }

  // Prise en compte de l'espagnol demandé par la vue de navigation
  setLanguage(lang: 'fr' | 'en' | 'ar' | 'es'): void {
    this.currentLanguage.set(lang);
    this.isRtlMode.set(lang === 'ar');

    if (lang === 'en') {
      this.currentCurrency.set('$');
    } else if (lang === 'es') {
      this.currentCurrency.set('€');
    } else {
      this.currentCurrency.set('MAD');
    }
  }
}
