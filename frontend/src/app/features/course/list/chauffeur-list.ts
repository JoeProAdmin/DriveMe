import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  ApiService,
  ChauffeurDocumentDTO,
  ChauffeurResponseDTO
} from '../../../core/api.service';

type DriverStatusFilter = 'TOUS' | 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';

@Component({
  selector: 'app-chauffeur-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './chauffeur-list.html',
  styleUrls: ['./chauffeur-list.css']
})
export class ChauffeurList implements OnInit {
  public readonly dossierTexts: Record<'fr' | 'en' | 'ar' | 'es', any> = {
    fr: { vehicle:'Véhicule', brand:'Marque', model:'Modèle', year:'Année', plate:'Immatriculation', documents:'Documents et contrôles', noVehicle:'Non renseigné', absent:'Document absent', open:'Ouvrir', approveDoc:'Valider', rejectDoc:'Refuser', pendingDoc:'En attente', approvedDoc:'Validé', rejectedDoc:'Refusé', mandatory:'Obligatoire', optional:'Complément', identityPhoto:'Photo de contrôle' },
    en: { vehicle:'Vehicle', brand:'Brand', model:'Model', year:'Year', plate:'Registration', documents:'Documents and checks', noVehicle:'Not provided', absent:'Missing document', open:'Open', approveDoc:'Approve', rejectDoc:'Reject', pendingDoc:'Pending', approvedDoc:'Approved', rejectedDoc:'Rejected', mandatory:'Required', optional:'Additional', identityPhoto:'Verification photo' },
    ar: { vehicle:'المركبة', brand:'العلامة', model:'الطراز', year:'السنة', plate:'لوحة التسجيل', documents:'الوثائق والتحقق', noVehicle:'غير متوفر', absent:'الوثيقة غير موجودة', open:'فتح', approveDoc:'اعتماد', rejectDoc:'رفض', pendingDoc:'قيد الانتظار', approvedDoc:'معتمد', rejectedDoc:'مرفوض', mandatory:'إلزامي', optional:'إضافي', identityPhoto:'صورة التحقق' },
    es: { vehicle:'Vehículo', brand:'Marca', model:'Modelo', year:'Año', plate:'Matrícula', documents:'Documentos y controles', noVehicle:'No informado', absent:'Documento ausente', open:'Abrir', approveDoc:'Validar', rejectDoc:'Rechazar', pendingDoc:'Pendiente', approvedDoc:'Validado', rejectedDoc:'Rechazado', mandatory:'Obligatorio', optional:'Adicional', identityPhoto:'Foto de control' }
  };

  public readonly documentTypes = [
    'CIN', 'PERMIS', 'CARTE_GRISE', 'ASSURANCE', 'SELFIE', 'VEHICULE_AVANT', 'VEHICULE_ARRIERE'
  ];

  public get d(): any { return this.dossierTexts[this.apiService.currentLanguage()]; }
  public readonly texts: Record<'fr' | 'en' | 'ar' | 'es', any> = {
    fr: { area:'Administration DriveMe', title:'Gestion des chauffeurs', subtitle:'Consultez les profils, contrôlez leur validation et supervisez l’état général de la flotte.', close:'Fermer', total:'Total chauffeurs', registered:'Profils enregistrés', approved:'Profils approuvés', authorized:'Autorisés sur la plateforme', pending:'En attente', review:'À contrôler par l’administration', rejected:'Profils rejetés', unauthorized:'Non autorisés actuellement', rating:'Note moyenne', fleetRating:'Évaluation globale de la flotte', balance:'Solde total', balances:'MAD disponibles sur les comptes', search:'Rechercher un chauffeur', placeholder:'Nom, prénom, email, téléphone ou identifiant', status:'Statut administratif', allStatuses:'Tous les statuts', approvedOne:'Approuvé', rejectedOne:'Rejeté', result:'résultat(s)', reset:'Réinitialiser', loadingDrivers:'Chargement des chauffeurs...', driver:'Chauffeur', contact:'Contact', ratingShort:'Note', balanceShort:'Solde', validation:'Validation', actions:'Actions', notFound:'Aucun chauffeur trouvé', file:'Fiche chauffeur', id:'Identifiant', fullName:'Nom complet', credit:'Solde crédit', view:'Voir', processing:'Traitement...', approve:'Approuver', suspend:'Suspendre', reject:'Rejeter', reconsider:'Réexaminer' },
    en: { area:'DriveMe Administration', title:'Driver management', subtitle:'View profiles, control validation and supervise the overall fleet.', close:'Close', total:'Total drivers', registered:'Registered profiles', approved:'Approved profiles', authorized:'Authorized on the platform', pending:'Pending', review:'To be reviewed by administration', rejected:'Rejected profiles', unauthorized:'Currently unauthorized', rating:'Average rating', fleetRating:'Overall fleet rating', balance:'Total balance', balances:'MAD available in accounts', search:'Search for a driver', placeholder:'Name, email, phone or identifier', status:'Administrative status', allStatuses:'All statuses', approvedOne:'Approved', rejectedOne:'Rejected', result:'result(s)', reset:'Reset', loadingDrivers:'Loading drivers...', driver:'Driver', contact:'Contact', ratingShort:'Rating', balanceShort:'Balance', validation:'Validation', actions:'Actions', notFound:'No driver found', file:'Driver record', id:'Identifier', fullName:'Full name', credit:'Credit balance', view:'View', processing:'Processing...', approve:'Approve', suspend:'Suspend', reject:'Reject', reconsider:'Review again' },
    ar: { area:'إدارة DriveMe', title:'إدارة السائقين', subtitle:'عرض الملفات والتحكم في اعتمادها والإشراف على الأسطول.', close:'إغلاق', total:'إجمالي السائقين', registered:'الملفات المسجلة', approved:'الملفات المعتمدة', authorized:'مصرح لهم على المنصة', pending:'قيد الانتظار', review:'تحتاج مراجعة الإدارة', rejected:'الملفات المرفوضة', unauthorized:'غير مصرح لهم حالياً', rating:'متوسط التقييم', fleetRating:'التقييم العام للأسطول', balance:'الرصيد الإجمالي', balances:'درهم متاح في الحسابات', search:'البحث عن سائق', placeholder:'الاسم أو البريد أو الهاتف أو المعرّف', status:'الحالة الإدارية', allStatuses:'كل الحالات', approvedOne:'معتمد', rejectedOne:'مرفوض', result:'نتيجة', reset:'إعادة ضبط', loadingDrivers:'جارٍ تحميل السائقين...', driver:'السائق', contact:'الاتصال', ratingShort:'التقييم', balanceShort:'الرصيد', validation:'الاعتماد', actions:'الإجراءات', notFound:'لم يتم العثور على سائق', file:'ملف السائق', id:'المعرّف', fullName:'الاسم الكامل', credit:'رصيد الحساب', view:'عرض', processing:'جارٍ التنفيذ...', approve:'اعتماد', suspend:'تعليق', reject:'رفض', reconsider:'إعادة المراجعة' },
    es: { area:'Administración DriveMe', title:'Gestión de conductores', subtitle:'Consulta perfiles, controla su validación y supervisa la flota.', close:'Cerrar', total:'Total conductores', registered:'Perfiles registrados', approved:'Perfiles aprobados', authorized:'Autorizados en la plataforma', pending:'Pendientes', review:'Por revisar por administración', rejected:'Perfiles rechazados', unauthorized:'No autorizados actualmente', rating:'Valoración media', fleetRating:'Valoración global de la flota', balance:'Saldo total', balances:'MAD disponibles en las cuentas', search:'Buscar un conductor', placeholder:'Nombre, correo, teléfono o identificador', status:'Estado administrativo', allStatuses:'Todos los estados', approvedOne:'Aprobado', rejectedOne:'Rechazado', result:'resultado(s)', reset:'Restablecer', loadingDrivers:'Cargando conductores...', driver:'Conductor', contact:'Contacto', ratingShort:'Valoración', balanceShort:'Saldo', validation:'Validación', actions:'Acciones', notFound:'No se encontró ningún conductor', file:'Ficha del conductor', id:'Identificador', fullName:'Nombre completo', credit:'Saldo de crédito', view:'Ver', processing:'Procesando...', approve:'Aprobar', suspend:'Suspender', reject:'Rechazar', reconsider:'Revisar de nuevo' }
  };

  public get t(): any { return this.texts[this.apiService.currentLanguage()]; }

  public chauffeurs: ChauffeurResponseDTO[] = [];
  public recherche = '';
  public filtreStatut: DriverStatusFilter = 'TOUS';

  public chargement = false;
  public actionEnCoursId: number | null = null;
  public documentActionEnCoursId: number | null = null;
  public selfieUrl: string | null = null;

  public messageSucces = '';
  public messageErreur = '';

  public chauffeurSelectionne: ChauffeurResponseDTO | null = null;
  public detailOuvert = false;

  constructor(
    public readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.loadChauffeurs();
  }

  public loadChauffeurs(): void {
    this.chargement = true;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.getAllChauffeurs(true)
      .pipe(
        finalize(() => {
          this.chargement = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data: ChauffeurResponseDTO[]) => {
          this.chauffeurs = Array.isArray(data) ? [...data] : [];
          this.cdr.markForCheck();
        },
        error: (erreur: unknown) => {
          console.error('Erreur lors du chargement des chauffeurs :', erreur);
          this.chauffeurs = [];
          this.messageErreur =
            'Impossible de charger les chauffeurs. Vérifiez que le backend est démarré.';
          this.cdr.markForCheck();
        }
      });
  }

  public get chauffeursFiltres(): ChauffeurResponseDTO[] {
    const terme = this.recherche.trim().toLocaleLowerCase('fr');

    return this.chauffeurs.filter((chauffeur: ChauffeurResponseDTO) => {
      const correspondAuStatut =
        this.filtreStatut === 'TOUS'
        || (this.filtreStatut === 'EN_ATTENTE' && chauffeur.statutValidation === 0)
        || (this.filtreStatut === 'APPROUVE' && chauffeur.statutValidation === 1)
        || (this.filtreStatut === 'REJETE' && chauffeur.statutValidation === 2);

      if (!correspondAuStatut) {
        return false;
      }

      if (!terme) {
        return true;
      }

      const contenuRecherche = [
        chauffeur.id,
        chauffeur.nom,
        chauffeur.prenom,
        chauffeur.email,
        chauffeur.telephone
      ]
        .filter((valeur: string | number | undefined) =>
          valeur !== null && valeur !== undefined
        )
        .join(' ')
        .toLocaleLowerCase('fr');

      return contenuRecherche.includes(terme);
    });
  }

  public get chauffeursValides(): number {
    return this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.statutValidation === 1
    ).length;
  }

  public get chauffeursEnAttente(): number {
    return this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.statutValidation === 0
    ).length;
  }

  public get chauffeursRejetes(): number {
    return this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.statutValidation === 2
    ).length;
  }

  public get soldeTotal(): number {
    return this.chauffeurs.reduce(
      (total: number, chauffeur: ChauffeurResponseDTO) =>
        total + Number(chauffeur.soldeCredit ?? 0),
      0
    );
  }

  public get noteMoyenneFlotte(): number {
    const chauffeursAvecNote = this.chauffeurs.filter(
      (chauffeur: ChauffeurResponseDTO) =>
        Number(chauffeur.noteMoyenne ?? 0) > 0
    );

    if (chauffeursAvecNote.length === 0) {
      return 0;
    }

    const totalNotes = chauffeursAvecNote.reduce(
      (total: number, chauffeur: ChauffeurResponseDTO) =>
        total + Number(chauffeur.noteMoyenne ?? 0),
      0
    );

    return totalNotes / chauffeursAvecNote.length;
  }

  public approuver(id: number): void {
    const chauffeur = this.trouverChauffeur(id);

    if (!chauffeur || chauffeur.statutValidation === 1) {
      return;
    }

    this.actionEnCoursId = id;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.validerChauffeur(id, 1).subscribe({
      next: () => {
        this.mettreAJourStatutLocal(id, 1);
        this.actionEnCoursId = null;
        this.messageSucces =
          `Le chauffeur ${this.nomComplet(chauffeur)} a été approuvé.`;
      },
      error: (erreur: unknown) => {
        console.error(`Erreur lors de l'approbation du chauffeur ${id} :`, erreur);
        this.actionEnCoursId = null;
        this.messageErreur = (erreur as any)?.error?.message || 'La validation du chauffeur a échoué.';
      }
    });
  }

  public rejeter(id: number): void {
    const chauffeur = this.trouverChauffeur(id);

    if (!chauffeur || chauffeur.statutValidation === 2) {
      return;
    }

    const confirmation = window.confirm(
      `Confirmer le rejet du chauffeur ${this.nomComplet(chauffeur)} ?`
    );

    if (!confirmation) {
      return;
    }

    this.actionEnCoursId = id;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.rejeter(id).subscribe({
      next: () => {
        this.mettreAJourStatutLocal(id, 2);
        this.actionEnCoursId = null;
        this.messageSucces =
          `Le chauffeur ${this.nomComplet(chauffeur)} a été rejeté.`;
      },
      error: (erreur: unknown) => {
        console.error(`Erreur lors du rejet du chauffeur ${id} :`, erreur);
        this.actionEnCoursId = null;
        this.messageErreur = 'Le rejet du chauffeur a échoué.';
      }
    });
  }

  public remettreEnAttente(id: number): void {
    const chauffeur = this.trouverChauffeur(id);

    if (!chauffeur || chauffeur.statutValidation === 0) {
      return;
    }

    const confirmation = window.confirm(
      `Replacer ${this.nomComplet(chauffeur)} dans les profils en attente ?`
    );

    if (!confirmation) {
      return;
    }

    this.actionEnCoursId = id;
    this.messageErreur = '';
    this.messageSucces = '';

    this.apiService.validerChauffeur(id, 0).subscribe({
      next: () => {
        this.mettreAJourStatutLocal(id, 0);
        this.actionEnCoursId = null;
        this.messageSucces =
          `Le chauffeur ${this.nomComplet(chauffeur)} est maintenant en attente.`;
      },
      error: (erreur: unknown) => {
        console.error(`Erreur lors du changement de statut du chauffeur ${id} :`, erreur);
        this.actionEnCoursId = null;
        this.messageErreur = 'Le changement de statut du chauffeur a échoué.';
      }
    });
  }

  public ouvrirDetail(chauffeur: ChauffeurResponseDTO): void {
    this.chauffeurSelectionne = { ...chauffeur };
    this.detailOuvert = true;
    this.chargerSelfie(chauffeur);
  }

  public fermerDetail(): void {
    this.libererSelfie();
    this.detailOuvert = false;
    this.chauffeurSelectionne = null;
  }

  public documentParType(type: string): ChauffeurDocumentDTO | undefined {
    return this.chauffeurSelectionne?.documents?.find(document => document.type === type);
  }

  public libelleTypeDocument(type: string): string {
    const labels: Record<string, Record<string, string>> = {
      fr: { CIN:'CIN', PERMIS:'Permis de conduire', CARTE_GRISE:'Carte grise', ASSURANCE:'Assurance', SELFIE:'Selfie avec CIN', VEHICULE_AVANT:'Photo véhicule avant', VEHICULE_ARRIERE:'Photo véhicule arrière' },
      en: { CIN:'ID card', PERMIS:'Driving licence', CARTE_GRISE:'Vehicle registration', ASSURANCE:'Insurance', SELFIE:'Selfie with ID', VEHICULE_AVANT:'Front vehicle photo', VEHICULE_ARRIERE:'Rear vehicle photo' },
      ar: { CIN:'البطاقة الوطنية', PERMIS:'رخصة السياقة', CARTE_GRISE:'البطاقة الرمادية', ASSURANCE:'التأمين', SELFIE:'صورة مع البطاقة', VEHICULE_AVANT:'صورة أمامية للمركبة', VEHICULE_ARRIERE:'صورة خلفية للمركبة' },
      es: { CIN:'Documento de identidad', PERMIS:'Permiso de conducir', CARTE_GRISE:'Permiso de circulación', ASSURANCE:'Seguro', SELFIE:'Selfie con documento', VEHICULE_AVANT:'Foto frontal del vehículo', VEHICULE_ARRIERE:'Foto trasera del vehículo' }
    };
    return labels[this.apiService.currentLanguage()]?.[type] || type;
  }

  public documentObligatoire(type: string): boolean {
    return ['CIN', 'PERMIS', 'CARTE_GRISE', 'ASSURANCE', 'SELFIE'].includes(type);
  }

  public libelleStatutDocument(statut?: string): string {
    if (statut === 'APPROUVE') return this.d.approvedDoc;
    if (statut === 'REJETE') return this.d.rejectedDoc;
    return this.d.pendingDoc;
  }

  public classeStatutDocument(statut?: string): string {
    if (statut === 'APPROUVE') return 'doc-approved';
    if (statut === 'REJETE') return 'doc-rejected';
    return 'doc-pending';
  }

  public formaterTaille(taille?: number): string {
    if (!taille) return '';
    if (taille >= 1024 * 1024) return `${(taille / (1024 * 1024)).toFixed(1)} Mo`;
    return `${Math.max(1, Math.round(taille / 1024))} Ko`;
  }

  public ouvrirDocument(document: ChauffeurDocumentDTO): void {
    if (!this.chauffeurSelectionne) return;
    this.apiService.getDocumentChauffeur(this.chauffeurSelectionne.id, document.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: () => { this.messageErreur = 'Impossible d’ouvrir ce document.'; }
    });
  }

  public validerDocument(document: ChauffeurDocumentDTO, statut: 'APPROUVE' | 'REJETE'): void {
    if (!this.chauffeurSelectionne) return;
    const chauffeurId = this.chauffeurSelectionne.id;
    this.documentActionEnCoursId = document.id;
    this.apiService.validerDocumentChauffeur(chauffeurId, document.id, statut).subscribe({
      next: updated => {
        this.remplacerDocumentLocal(chauffeurId, updated);
        this.documentActionEnCoursId = null;
        this.cdr.markForCheck();
      },
      error: (erreur: any) => {
        this.documentActionEnCoursId = null;
        this.messageErreur = erreur?.error?.message || 'La validation du document a échoué.';
      }
    });
  }

  public effacerRecherche(): void {
    this.recherche = '';
    this.filtreStatut = 'TOUS';
  }

  public estActionEnCours(id: number): boolean {
    return this.actionEnCoursId === id;
  }

  public nomComplet(chauffeur: ChauffeurResponseDTO): string {
    const nomComplet = [
      chauffeur.prenom?.trim(),
      chauffeur.nom?.trim()
    ].filter(Boolean).join(' ');

    return nomComplet || `Chauffeur #${chauffeur.id}`;
  }

  public initiales(chauffeur: ChauffeurResponseDTO): string {
    const prenom = chauffeur.prenom?.trim().charAt(0) ?? '';
    const nom = chauffeur.nom?.trim().charAt(0) ?? '';
    const resultat = `${prenom}${nom}`.toUpperCase();

    return resultat || 'CH';
  }

  public libelleStatut(statut: number): string {
    switch (statut) {
      case 1:
        return 'Approuvé';
      case 2:
        return 'Rejeté';
      default:
        return 'En attente';
    }
  }

  public classeStatut(statut: number): string {
    switch (statut) {
      case 1:
        return 'tag-emerald';
      case 2:
        return 'tag-red';
      default:
        return 'tag-amber';
    }
  }

  public formaterNote(note?: number): string {
    return Number(note ?? 0).toFixed(1);
  }

  public formaterSolde(solde?: number): string {
    return new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(solde ?? 0));
  }

  public suivreChauffeur(index: number, chauffeur: ChauffeurResponseDTO): number {
    return chauffeur.id;
  }

  private trouverChauffeur(id: number): ChauffeurResponseDTO | undefined {
    return this.chauffeurs.find(
      (chauffeur: ChauffeurResponseDTO) => chauffeur.id === id
    );
  }

  private mettreAJourStatutLocal(id: number, nouveauStatut: number): void {
    this.chauffeurs = this.chauffeurs.map(
      (chauffeur: ChauffeurResponseDTO) =>
        chauffeur.id === id
          ? { ...chauffeur, statutValidation: nouveauStatut }
          : chauffeur
    );

    if (this.chauffeurSelectionne?.id === id) {
      this.chauffeurSelectionne = {
        ...this.chauffeurSelectionne,
        statutValidation: nouveauStatut
      };
    }
  }

  private remplacerDocumentLocal(chauffeurId: number, document: ChauffeurDocumentDTO): void {
    const update = (chauffeur: ChauffeurResponseDTO): ChauffeurResponseDTO => ({
      ...chauffeur,
      documents: (chauffeur.documents || []).map(item => item.id === document.id ? document : item)
    });
    this.chauffeurs = this.chauffeurs.map(chauffeur => chauffeur.id === chauffeurId ? update(chauffeur) : chauffeur);
    if (this.chauffeurSelectionne?.id === chauffeurId) {
      this.chauffeurSelectionne = update(this.chauffeurSelectionne);
    }
  }

  private chargerSelfie(chauffeur: ChauffeurResponseDTO): void {
    this.libererSelfie();
    const selfie = chauffeur.documents?.find(document => document.type === 'SELFIE');
    if (!selfie) return;
    this.apiService.getDocumentChauffeur(chauffeur.id, selfie.id).subscribe({
      next: blob => {
        if (blob.type.startsWith('image/')) {
          this.selfieUrl = URL.createObjectURL(blob);
          this.cdr.markForCheck();
        }
      }
    });
  }

  private libererSelfie(): void {
    if (this.selfieUrl) URL.revokeObjectURL(this.selfieUrl);
    this.selfieUrl = null;
  }
}
