import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminStats {
  totalChauffeurs: number;
  totalPassagers: number;
  totalCourses: number;
  totalPaiements: number;
}

export interface AvisDTO {
  id?: number;
  courseId: number;
  note: number;
  commentaire: string;
}

export interface ChauffeurResponseDTO {
  id: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  statutValidation: number;
  noteMoyenne?: number;
  soldeCredit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public readonly currentLanguage: WritableSignal<'fr' | 'en' | 'ar' | 'es'> =
    signal('fr');

  public readonly isRtlMode: WritableSignal<boolean> =
    signal(false);

  public setLanguage(lang: 'fr' | 'en' | 'ar' | 'es'): void {
    this.currentLanguage.set(lang);
    this.isRtlMode.set(lang === 'ar');
  }

  public login(credentials: {
    email: string;
    motDePasse: string;
  }): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/auth/login`,
      credentials
    );
  }

  public registerUser(data: any): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/auth/register`,
      data
    );
  }

  public getAdminStats(): Observable<AdminStats> {

    return this.http.get<AdminStats>(
      `${this.baseUrl}/admin/stats`
    );
  }

  public getAllChauffeurs(): Observable<ChauffeurResponseDTO[]> {

    return this.http.get<ChauffeurResponseDTO[]>(
      `${this.baseUrl}/chauffeurs`
    );
  }

  public getAllPassagers(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/passagers`
    );
  }

  public validerChauffeur(
    id: number,
    statut: number
  ): Observable<void> {

    return this.http.put<void>(
      `${this.baseUrl}/chauffeurs/${id}/validation?statut=${statut}`,
      {}
    );
  }

  public rejeter(id: number): Observable<void> {

    return this.validerChauffeur(id, 2);
  }

  public getCourses(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/courses`
    );
  }

  public getCoursesByPassager(
    passagerId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/courses/passager/${passagerId}`
    );
  }

  public getCoursesByChauffeur(
    chauffeurId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/courses/chauffeur/${chauffeurId}`
    );
  }

  public requestCourse(
    courseData: any
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/courses`,
      courseData
    );
  }

  public soumettreAvis(
    avis: AvisDTO
  ): Observable<void> {

    return this.http.post<void>(
      `${this.baseUrl}/avis`,
      avis
    );
  }

  public uploadSelfieVerification(
    id: number,
    file: File
  ): Observable<any> {

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post(
      `${this.baseUrl}/chauffeurs/${id}/selfie`,
      formData
    );
  }
}
