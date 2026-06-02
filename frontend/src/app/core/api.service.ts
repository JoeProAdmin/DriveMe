import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  public currentLanguage: WritableSignal<'fr' | 'en' | 'ar' | 'es'> = signal('fr');
  public currentCurrency: WritableSignal<'MAD' | '€' | '$'> = signal('MAD');
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

  logout(): void {
    localStorage.clear();
    this.authSubject.next(null);
  }

  setLanguage(lang: 'fr' | 'en' | 'ar' | 'es'): void {
    this.currentLanguage.set(lang);
    this.isRtlMode.set(lang === 'ar');

    if (lang === 'ar') {
      this.currentCurrency.set('MAD');
    } else if (lang === 'en') {
      this.currentCurrency.set('$');
    } else {
      this.currentCurrency.set('€');
    }
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

  getChauffeurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/chauffeurs`);
  }

  deleteChauffeur(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/chauffeurs/${id}`);
  }
}
