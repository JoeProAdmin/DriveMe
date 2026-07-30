import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminStats { totalChauffeurs: number; totalPassagers: number; totalCourses: number; totalPaiements: number; }
export interface AvisDTO { id?: number; courseId: number; note: number; commentaire: string; }
export interface ChauffeurResponseDTO { id: number; nom?: string; prenom?: string; email?: string; telephone?: string; statutValidation: number; noteMoyenne?: number; soldeCredit?: number; }
export interface PassagerResponseDTO { id: number; nom?: string; prenom?: string; telephone?: string; email?: string; photoUrl?: string; dateCreation?: string; }
export interface PropositionCreateDTO { courseId: number; chauffeurId: number; prixPropose: number; distanceChauffeurDepart?: number; tempsEstimeMinutes?: number; message?: string; }
export interface PropositionResponseDTO { id: number; courseId: number; chauffeurId: number; chauffeurNom: string; noteMoyenne: number; prixPropose: number; distanceChauffeurDepart: number; tempsEstimeMinutes: number; message: string; statut: string; dateCreation: string; }

export type PaiementMethode = 'CARTE' | 'CASH' | 'ONLINE';
export interface PaiementCreateDTO { courseId: number; methode: PaiementMethode; }
export interface PaiementResponseDTO {
  id: number;
  courseId: number;
  montant: number;
  methode: string;
  statut: string;
  datePaiement: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private chauffeurs$?: Observable<ChauffeurResponseDTO[]>;
  private passagers$?: Observable<PassagerResponseDTO[]>;
  private paiements$?: Observable<PaiementResponseDTO[]>;
  public readonly currentLanguage: WritableSignal<'fr' | 'en' | 'ar' | 'es'> = signal('fr');
  public readonly isRtlMode: WritableSignal<boolean> = signal(false);

  public setLanguage(lang: 'fr' | 'en' | 'ar' | 'es'): void { this.currentLanguage.set(lang); this.isRtlMode.set(lang === 'ar'); }
  public login(credentials: { identifiant: string; motDePasse: string }): Observable<any> { return this.http.post(`${this.baseUrl}/auth/login`, credentials); }
  public registerUser(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/auth/register`, data); }
  public getAdminStats(): Observable<AdminStats> { return this.http.get<AdminStats>(`${this.baseUrl}/admin/stats`); }
  public getAllChauffeurs(forceRefresh = false): Observable<ChauffeurResponseDTO[]> {

    if (!this.chauffeurs$ || forceRefresh) {

      this.chauffeurs$ = this.http
        .get<ChauffeurResponseDTO[]>(`${this.baseUrl}/chauffeurs`)
        .pipe(
          shareReplay(1)
        );

    }

    return this.chauffeurs$;
  }
  public getChauffeurByEmail(email: string): Observable<ChauffeurResponseDTO> { return this.http.get<ChauffeurResponseDTO>(`${this.baseUrl}/chauffeurs/email/${encodeURIComponent(email)}`); }
  public getAllPassagers(forceRefresh = false): Observable<PassagerResponseDTO[]> {

    if (!this.passagers$ || forceRefresh) {

      this.passagers$ = this.http
        .get<PassagerResponseDTO[]>(`${this.baseUrl}/passagers`)
        .pipe(
          shareReplay(1)
        );

    }

    return this.passagers$;
  }
  public getPassagerByEmail(email: string): Observable<PassagerResponseDTO> { return this.http.get<PassagerResponseDTO>(`${this.baseUrl}/passagers/email/${encodeURIComponent(email)}`); }
  public updatePassager(id: number, data: PassagerResponseDTO): Observable<PassagerResponseDTO> { return this.http.put<PassagerResponseDTO>(`${this.baseUrl}/passagers/${id}`, data); }
  public deletePassager(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/passagers/${id}`); }
  public validerChauffeur(id: number, statut: number): Observable<void> { return this.http.put<void>(`${this.baseUrl}/chauffeurs/${id}/validation?statut=${statut}`, {}); }
  public rejeter(id: number): Observable<void> { return this.validerChauffeur(id, 2); }
  public getCourses(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/courses`); }
  public getCoursesByPassager(passagerId: number): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/courses/passager/${passagerId}`); }
  public getCoursesByChauffeur(chauffeurId: number): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/courses/chauffeur/${chauffeurId}`); }
  public getCoursesEnAttente(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/courses/en-attente`); }
  public requestCourse(courseData: any): Observable<any> { return this.http.post(`${this.baseUrl}/courses`, courseData); }
  public updateCourseStatus(courseId: number, status: string): Observable<any> { return this.http.put(`${this.baseUrl}/courses/${courseId}/status?status=${status}`, {}); }
  public soumettreAvis(avis: AvisDTO): Observable<void> { return this.http.post<void>(`${this.baseUrl}/avis`, avis); }
  public creerProposition(proposition: PropositionCreateDTO): Observable<PropositionResponseDTO> { return this.http.post<PropositionResponseDTO>(`${this.baseUrl}/propositions`, proposition); }
  public getPropositionsByCourse(courseId: number): Observable<PropositionResponseDTO[]> { return this.http.get<PropositionResponseDTO[]>(`${this.baseUrl}/propositions/course/${courseId}`); }
  public getPropositionsByChauffeur(chauffeurId: number): Observable<PropositionResponseDTO[]> { return this.http.get<PropositionResponseDTO[]>(`${this.baseUrl}/propositions/chauffeur/${chauffeurId}`); }
  public choisirProposition(courseId: number, propositionId: number): Observable<PropositionResponseDTO> { return this.http.put<PropositionResponseDTO>(`${this.baseUrl}/propositions/${courseId}/choisir/${propositionId}`, {}); }
  public validerPaiement(payload: PaiementCreateDTO): Observable<PaiementResponseDTO> { return this.http.post<PaiementResponseDTO>(`${this.baseUrl}/paiements/valider`, payload); }
  public getPaiementByCourse(courseId: number): Observable<PaiementResponseDTO> { return this.http.get<PaiementResponseDTO>(`${this.baseUrl}/paiements/course/${courseId}`); }
  public getAllPaiements(forceRefresh = false): Observable<PaiementResponseDTO[]> {

    if (!this.paiements$ || forceRefresh) {

      this.paiements$ = this.http
        .get<PaiementResponseDTO[]>(`${this.baseUrl}/paiements`)
        .pipe(
          shareReplay(1)
        );

    }

    return this.paiements$;
  }
  public uploadSelfieVerification(id: number, file: File): Observable<any> { const formData = new FormData(); formData.append('file', file); return this.http.post(`${this.baseUrl}/chauffeurs/${id}/selfie`, formData); }
}
