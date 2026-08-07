import {
  Injectable,
  WritableSignal,
  inject,
  signal
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { APP_TRANSLATIONS } from './app-translations';

export type AppLanguage = 'fr' | 'en' | 'ar' | 'es';

export interface AdminStats {
  totalChauffeurs: number;
  totalPassagers: number;
  totalCourses: number;
  totalPaiements: number;
  paiementsPayes?: number;
  montantPaiementsPayes?: number;
  soldeCreditsChauffeurs?: number;
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
  disponible?: boolean;
  latitudeActuelle?: number | null;
  longitudeActuelle?: number | null;
  dernierePositionAt?: string | null;
  marqueVehicule?: string;
  modeleVehicule?: string;
  anneeVehicule?: number;
  immatriculation?: string;
  documents?: ChauffeurDocumentDTO[];
}

export type DocumentValidationStatus = 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';

export interface ChauffeurDocumentDTO {
  id: number;
  type: string;
  nomOriginal: string;
  typeContenu: string;
  tailleOctets: number;
  statutValidation: DocumentValidationStatus;
  dateDepot?: string;
  dateValidation?: string;
}

export interface PassagerResponseDTO {
  id: number;
  nom?: string;
  prenom?: string;
  telephone?: string;
  email?: string;
  photoUrl?: string;
  dateCreation?: string;
}

export interface CourseCreateDTO {
  adresseDepart: string;
  adresseArrivee: string;
  prix: number;
  latitudeDepart: number;
  longitudeDepart: number;
  latitudeArrivee: number;
  longitudeArrivee: number;
  distanceKm?: number | null;
  dureeEstimeeMinutes?: number | null;
  prixEstime?: number | null;
}

export interface CourseResponseDTO extends CourseCreateDTO {
  id: number;
  passagerNom: string;
  chauffeurNom?: string | null;
  statut: string;
  dateCreation: string;
  paiementStatut: string | null;
  avisDepose: boolean;
}

export interface PropositionCreateDTO {
  prixPropose: number;
  distanceChauffeurDepart?: number;
  tempsEstimeMinutes?: number;
  message?: string;
}

export interface PropositionResponseDTO {
  id: number;
  courseId: number;
  chauffeurId: number;
  chauffeurNom: string;
  noteMoyenne: number;
  prixPropose: number;
  distanceChauffeurDepart: number;
  tempsEstimeMinutes: number;
  message: string;
  statut: string;
  dateCreation: string;
}

export type PaiementMethode = 'CARTE' | 'CASH' | 'ONLINE';

export interface PaiementCreateDTO {
  courseId: number;
  methode: PaiementMethode;
}

export interface PaiementResponseDTO {
  id: number;
  courseId: number;
  montant: number;
  methode: string;
  statut: string;
  datePaiement: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private chauffeurs$?: Observable<ChauffeurResponseDTO[]>;
  private passagers$?: Observable<PassagerResponseDTO[]>;
  private paiements$?: Observable<PaiementResponseDTO[]>;

  public readonly currentLanguage: WritableSignal<AppLanguage> = signal(
    this.readStoredLanguage()
  );

  public readonly isRtlMode: WritableSignal<boolean> = signal(
    this.currentLanguage() === 'ar'
  );

  constructor() {
    this.applyDocumentLanguage(this.currentLanguage());
  }

  public setLanguage(lang: AppLanguage): void {
    this.currentLanguage.set(lang);
    this.isRtlMode.set(lang === 'ar');

    localStorage.setItem('drivemeLanguage', lang);
    this.applyDocumentLanguage(lang);
  }

  public t(key: string): string {
    const translation = APP_TRANSLATIONS[key];

    return (
      translation?.[this.currentLanguage()] ??
      translation?.fr ??
      key
    );
  }

  private readStoredLanguage(): AppLanguage {
    const storedLanguage = localStorage.getItem('drivemeLanguage');

    if (
      storedLanguage === 'en' ||
      storedLanguage === 'ar' ||
      storedLanguage === 'es'
    ) {
      return storedLanguage;
    }

    return 'fr';
  }

  private applyDocumentLanguage(lang: AppLanguage): void {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  // ============================================================
  // AUTHENTIFICATION
  // ============================================================

  public login(credentials: {
    identifiant: string;
    motDePasse: string;
  }): Observable<unknown> {
    return this.http.post(
      `${this.baseUrl}/auth/login`,
      credentials
    );
  }

  public registerUser(data: unknown): Observable<unknown> {
    return this.http.post(
      `${this.baseUrl}/auth/register`,
      data
    );
  }

  public registerChauffeur(data: FormData): Observable<unknown> {
    return this.http.post(
      `${this.baseUrl}/auth/register/chauffeur`,
      data
    );
  }

  // ============================================================
  // ADMINISTRATION
  // ============================================================

  public getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(
      `${this.baseUrl}/admin/stats`
    );
  }

  // ============================================================
  // CHAUFFEURS
  // ============================================================

  public getAllChauffeurs(
    forceRefresh = false
  ): Observable<ChauffeurResponseDTO[]> {
    if (!this.chauffeurs$ || forceRefresh) {
      this.chauffeurs$ = this.http
        .get<ChauffeurResponseDTO[]>(
          `${this.baseUrl}/chauffeurs`
        )
        .pipe(
          shareReplay({
            bufferSize: 1,
            refCount: false
          })
        );
    }

    return this.chauffeurs$;
  }

  /**
   * Route réservée à l'administration.
   */
  public getChauffeurByEmail(
    email: string
  ): Observable<ChauffeurResponseDTO> {
    return this.http.get<ChauffeurResponseDTO>(
      `${this.baseUrl}/chauffeurs/email/${encodeURIComponent(email)}`
    );
  }

  /**
   * Retourne le chauffeur connecté à partir du JWT.
   */
  public getCurrentChauffeur(): Observable<ChauffeurResponseDTO> {
    return this.http.get<ChauffeurResponseDTO>(
      `${this.baseUrl}/chauffeurs/me`
    );
  }

  public updateCurrentDriverPosition(
    latitude: number,
    longitude: number
  ): Observable<ChauffeurResponseDTO> {
    return this.http.patch<ChauffeurResponseDTO>(
      `${this.baseUrl}/chauffeurs/me/position`,
      { latitude, longitude }
    );
  }

  public updateCurrentDriverAvailability(
    disponible: boolean
  ): Observable<ChauffeurResponseDTO> {
    return this.http.patch<ChauffeurResponseDTO>(
      `${this.baseUrl}/chauffeurs/me/disponibilite`,
      { disponible }
    );
  }

  public validerChauffeur(
    id: number,
    statut: number
  ): Observable<void> {
    return this.http
      .put<void>(
        `${this.baseUrl}/chauffeurs/${id}/validation?statut=${statut}`,
        {}
      )
      .pipe(
        tap(() => {
          this.chauffeurs$ = undefined;
        })
      );
  }

  public rejeter(id: number): Observable<void> {
    return this.validerChauffeur(id, 2);
  }

  public validerDocumentChauffeur(
    chauffeurId: number,
    documentId: number,
    statut: DocumentValidationStatus
  ): Observable<ChauffeurDocumentDTO> {
    return this.http
      .put<ChauffeurDocumentDTO>(
        `${this.baseUrl}/chauffeurs/${chauffeurId}/documents/${documentId}/validation?statut=${statut}`,
        {}
      )
      .pipe(tap(() => { this.chauffeurs$ = undefined; }));
  }

  public getDocumentChauffeur(
    chauffeurId: number,
    documentId: number
  ): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/chauffeurs/${chauffeurId}/documents/${documentId}/content`,
      { responseType: 'blob' }
    );
  }

  public uploadSelfieVerification(
    id: number,
    file: File
  ): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.baseUrl}/chauffeurs/${id}/selfie`,
      formData
    );
  }

  // ============================================================
  // PASSAGERS
  // ============================================================

  public getAllPassagers(
    forceRefresh = false
  ): Observable<PassagerResponseDTO[]> {
    if (!this.passagers$ || forceRefresh) {
      this.passagers$ = this.http
        .get<PassagerResponseDTO[]>(
          `${this.baseUrl}/passagers`
        )
        .pipe(
          shareReplay({
            bufferSize: 1,
            refCount: false
          })
        );
    }

    return this.passagers$;
  }

  /**
   * Route réservée à l'administration.
   */
  public getPassagerByEmail(
    email: string
  ): Observable<PassagerResponseDTO> {
    return this.http.get<PassagerResponseDTO>(
      `${this.baseUrl}/passagers/email/${encodeURIComponent(email)}`
    );
  }

  public updatePassager(
    id: number,
    data: PassagerResponseDTO
  ): Observable<PassagerResponseDTO> {
    return this.http
      .put<PassagerResponseDTO>(
        `${this.baseUrl}/passagers/${id}`,
        data
      )
      .pipe(
        tap(() => {
          this.passagers$ = undefined;
        })
      );
  }

  public deletePassager(id: number): Observable<void> {
    return this.http
      .delete<void>(
        `${this.baseUrl}/passagers/${id}`
      )
      .pipe(
        tap(() => {
          this.passagers$ = undefined;
        })
      );
  }

  // ============================================================
  // COURSES
  // ============================================================

  /**
   * Route générale utilisée par l'administration.
   */
  public getCourses(): Observable<CourseResponseDTO[]> {
    return this.http.get<CourseResponseDTO[]>(
      `${this.baseUrl}/courses`
    );
  }

  /**
   * Route d'administration conservée pour consulter
   * les courses d'un passager déterminé.
   */
  public getCoursesByPassager(
    passagerId: number
  ): Observable<CourseResponseDTO[]> {
    return this.http.get<CourseResponseDTO[]>(
      `${this.baseUrl}/courses/passager/${passagerId}`
    );
  }

  /**
   * Route d'administration conservée pour consulter
   * les courses d'un chauffeur déterminé.
   */
  public getCoursesByChauffeur(
    chauffeurId: number
  ): Observable<CourseResponseDTO[]> {
    return this.http.get<CourseResponseDTO[]>(
      `${this.baseUrl}/courses/chauffeur/${chauffeurId}`
    );
  }

  /**
   * Retourne les courses du passager connecté.
   * L'identité du passager provient du JWT.
   */
  public getCurrentPassengerCourses(): Observable<CourseResponseDTO[]> {
    return this.http.get<CourseResponseDTO[]>(
      `${this.baseUrl}/courses/passager/me`
    );
  }

  /**
   * Retourne les courses du chauffeur connecté.
   * L'identité du chauffeur provient du JWT.
   */
  public getCurrentDriverCourses(): Observable<CourseResponseDTO[]> {
    return this.http.get<CourseResponseDTO[]>(
      `${this.baseUrl}/courses/chauffeur/me`
    );
  }

  public getCoursesEnAttente(): Observable<CourseResponseDTO[]> {
    return this.http.get<CourseResponseDTO[]>(
      `${this.baseUrl}/courses/en-attente`
    );
  }

  public requestCourse(
    courseData: CourseCreateDTO
  ): Observable<CourseResponseDTO> {
    return this.http.post<CourseResponseDTO>(
      `${this.baseUrl}/courses`,
      courseData
    );
  }

  /**
   * Cette route historique est conservée pour l'administration.
   * Elle ne doit pas être utilisée par le chauffeur pour terminer
   * une course tant que le backend sécurisé n'a pas été adapté.
   */
  public updateCourseStatus(
    courseId: number,
    status: string
  ): Observable<CourseResponseDTO> {
    return this.http.put<CourseResponseDTO>(
      `${this.baseUrl}/courses/${courseId}/status?status=${encodeURIComponent(status)}`,
      {}
    );
  }
  /**
   * Fait progresser la course du chauffeur connecté.
   *
   * L'identité du chauffeur est extraite du JWT et le backend
   * contrôle l'appartenance ainsi que l'ordre des transitions.
   */
  public updateCurrentDriverCourseStatus(
    courseId: number,
    status: string
  ): Observable<CourseResponseDTO> {
    return this.http.put<CourseResponseDTO>(
      `${this.baseUrl}/courses/chauffeur/me/${courseId}/status?status=${encodeURIComponent(status)}`,
      {}
    );
  }

  // ============================================================
  // PROPOSITIONS CHAUFFEUR — RC3.1B
  // ============================================================

  /**
   * Crée une proposition pour une course.
   *
   * Le courseId est transmis dans l'URL.
   * Le chauffeur est identifié par le JWT.
   */
  public creerProposition(
    courseId: number,
    proposition: PropositionCreateDTO
  ): Observable<PropositionResponseDTO> {
    return this.http.post<PropositionResponseDTO>(
      `${this.baseUrl}/courses/${courseId}/propositions`,
      proposition
    );
  }

  /**
   * Retourne les propositions d'une course.
   */
  public getPropositionsByCourse(
    courseId: number
  ): Observable<PropositionResponseDTO[]> {
    return this.http.get<PropositionResponseDTO[]>(
      `${this.baseUrl}/courses/${courseId}/propositions`
    );
  }

  /**
   * Retourne les propositions du chauffeur connecté.
   * L'identité du chauffeur provient du JWT.
   */
  public getCurrentDriverPropositions(): Observable<
    PropositionResponseDTO[]
  > {
    return this.http.get<PropositionResponseDTO[]>(
      `${this.baseUrl}/chauffeurs/me/propositions`
    );
  }

  /**
   * Accepte une proposition au nom du passager connecté.
   * L'identité du passager et la propriété de la course
   * sont contrôlées par le backend.
   */
  public accepterProposition(
    propositionId: number
  ): Observable<PropositionResponseDTO> {
    return this.http.post<PropositionResponseDTO>(
      `${this.baseUrl}/propositions/${propositionId}/accepter`,
      {}
    );
  }

  // ============================================================
  // AVIS
  // ============================================================

  public soumettreAvis(avis: AvisDTO): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/avis`,
      avis
    );
  }

  // ============================================================
  // PAIEMENTS
  // ============================================================

  public validerPaiement(
    payload: PaiementCreateDTO
  ): Observable<PaiementResponseDTO> {
    return this.http.post<PaiementResponseDTO>(
      `${this.baseUrl}/paiements/valider`,
      payload
    );
  }

  public getPaiementByCourse(
    courseId: number
  ): Observable<PaiementResponseDTO> {
    return this.http.get<PaiementResponseDTO>(
      `${this.baseUrl}/paiements/course/${courseId}`
    );
  }

  public getMesPaiements(): Observable<PaiementResponseDTO[]> {
    return this.http.get<PaiementResponseDTO[]>(
      `${this.baseUrl}/paiements/me`
    );
  }

  public getAllPaiements(
    forceRefresh = false
  ): Observable<PaiementResponseDTO[]> {
    if (!this.paiements$ || forceRefresh) {
      this.paiements$ = this.http
        .get<PaiementResponseDTO[]>(
          `${this.baseUrl}/paiements`
        )
        .pipe(
          shareReplay({
            bufferSize: 1,
            refCount: false
          })
        );
    }

    return this.paiements$;
  }
}
