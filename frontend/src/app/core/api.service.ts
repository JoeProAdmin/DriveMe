import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminStats { totalChauffeurs: number; totalPassagers: number; totalCourses: number; totalPaiements: number; }
export interface AvisDTO { id?: number; courseId: number; note: number; commentaire: string; }
export interface ChauffeurResponseDTO {
  id: number; nom?: string; prenom?: string; email?: string; telephone?: string;
  statutValidation: number; noteMoyenne?: number; soldeCredit?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  public currentLanguage: WritableSignal<'fr' | 'en' | 'ar' | 'es'> = signal('fr');
  public isRtlMode: WritableSignal<boolean> = signal(false);

  setLanguage(lang: 'fr' | 'en' | 'ar' | 'es'): void {
    this.currentLanguage.set(lang);
    this.isRtlMode.set(lang === 'ar');
  }

  // API COURSES & STATS
  getAdminStats(): Observable<AdminStats> { return this.http.get<AdminStats>(`${this.baseUrl}/admin/stats`); }
  getAllChauffeurs(): Observable<ChauffeurResponseDTO[]> { return this.http.get<ChauffeurResponseDTO[]>(`${this.baseUrl}/chauffeurs`); }
  getCourses(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/courses`); }

  // VALIDATION & ACTIONS
  validerChauffeur(id: number, statut: number): Observable<any> { return this.http.put<any>(`${this.baseUrl}/chauffeurs/${id}/validation?statut=${statut}`, {}); }
  rejeter(id: number): Observable<any> { return this.http.put<any>(`${this.baseUrl}/chauffeurs/${id}/validation?statut=2`, {}); }
  soumettreAvis(avis: AvisDTO): Observable<any> { return this.http.post<any>(`${this.baseUrl}/avis`, avis); }

  // AUTH & INSCRIPTION
  registerUser(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/auth/register`, data); }
  uploadSelfieVerification(id: number, file: File): Observable<any> {
    const fd = new FormData(); fd.append('selfie', file);
    return this.http.post(`${this.baseUrl}/chauffeurs/${id}/selfie`, fd);
  }
}
