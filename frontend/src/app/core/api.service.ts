import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces
export interface AvisDTO { id?: number; courseId: number; note: number; commentaire: string; dateCreation?: string; }
export interface ChauffeurResponseDTO { id: number; nom?: string; prenom?: string; statutValidation: string | number; }
export interface AdminStats { totalChauffeurs: number; totalPassagers: number; totalCourses: number; totalPaiements: number; }
export interface UserSession { token: string; userId: string; role: 'ADMIN' | 'CHAUFFEUR' | 'PASSAGER'; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public currentLanguage: WritableSignal<'fr' | 'en' | 'ar' | 'es'> = signal('fr');
  public isRtlMode: WritableSignal<boolean> = signal(false);

  private authSubject = new BehaviorSubject<UserSession | null>(null);
  public auth$ = this.authSubject.asObservable();

  // --- Auth & Register ---
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: { email: string; motDePasse: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          this.authSubject.next({ token: res.token, userId: res.userId, role: res.role });
        }
      })
    );
  }

  // --- Courses & Avis ---
  soumettreAvis(avis: AvisDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/avis`, avis);
  }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/courses`, courseData);
  }

  // --- Administration & Chauffeurs ---
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/admin/stats`);
  }

  getAllChauffeurs(): Observable<ChauffeurResponseDTO[]> {
    return this.http.get<ChauffeurResponseDTO[]>(`${this.baseUrl}/chauffeurs`);
  }

  validerChauffeur(id: number, statutByte: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/chauffeurs/${id}/validation?statut=${statutByte}`, {});
  }

  // --- UI & Language ---
  setLanguage(lang: 'fr' | 'en' | 'ar' | 'es'): void {
    this.currentLanguage.set(lang);
    this.isRtlMode.set(lang === 'ar');
  }
}
