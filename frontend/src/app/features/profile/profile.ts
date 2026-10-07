import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ChauffeurResponseDTO } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  userRole = '';
  userEmail = '';
  today = new Date();
  chauffeur?: ChauffeurResponseDTO;
  typeChauffeur: ChauffeurResponseDTO['typeChauffeur'] = null;
  statutValidation = 0;
  categorieProfessionnelleLabel = '';
  validationAdministrativeLabel = '';
  validationAdministrativeClass = 'pending';

  noteMoyenne = Number(localStorage.getItem('chauffeurNoteMoyenne') || 0);
  soldeCredit = Number(localStorage.getItem('chauffeurSoldeCredit') || 0);

  public texts = {
    FR: { title: 'Mon Profil', subtitle: 'Informations personnelles DriveMe', account: 'Compte utilisateur', email: 'Email', role: 'Rôle', driverRole: 'Chauffeur', status: 'Validation administrative', pending: 'En attente', validated: 'Validé', rejected: 'Rejeté', category: 'Catégorie professionnelle', privateDriver: 'Chauffeur privé', officialTaxi: 'Taxi officiel', touristCarrier: 'Transporteur touristique', notDefined: 'Non définie', platform: 'Plateforme', driverSpace: 'Espace Chauffeur', rating: 'Note moyenne', credits: 'Crédits DriveMe', welcomeBonus: 'Bonus de bienvenue inclus', security: 'Sécurité', auth: 'Authentification', conn: 'Connexion', connVal: 'Sécurisée', lastAct: 'Dernière activité' },
    EN: { title: 'My Profile', subtitle: 'DriveMe personal information', account: 'User Account', email: 'Email', role: 'Role', driverRole: 'Driver', status: 'Administrative approval', pending: 'Pending', validated: 'Approved', rejected: 'Rejected', category: 'Professional category', privateDriver: 'Private driver', officialTaxi: 'Official taxi', touristCarrier: 'Tourist transport operator', notDefined: 'Not defined', platform: 'Platform', driverSpace: 'Driver Space', rating: 'Average Rating', credits: 'DriveMe Credits', welcomeBonus: 'Welcome bonus included', security: 'Security', auth: 'Authentication', conn: 'Connection', connVal: 'Secure', lastAct: 'Last activity' },
    AR: { title: 'ملفي الشخصي', subtitle: 'معلومات DriveMe الشخصية', account: 'حساب المستخدم', email: 'البريد الإلكتروني', role: 'الدور', driverRole: 'سائق', status: 'الموافقة الإدارية', pending: 'قيد الانتظار', validated: 'تمت الموافقة', rejected: 'مرفوض', category: 'الفئة المهنية', privateDriver: 'سائق خاص', officialTaxi: 'سيارة أجرة رسمية', touristCarrier: 'ناقل سياحي', notDefined: 'غير محددة', platform: 'المنصة', driverSpace: 'فضاء السائق', rating: 'متوسط التقييم', credits: 'رصيد DriveMe', welcomeBonus: 'يشمل مكافأة الترحيب', security: 'الأمان', auth: 'المصادقة', conn: 'الاتصال', connVal: 'آمن', lastAct: 'آخر نشاط' },
    ES: { title: 'Mi Perfil', subtitle: 'Información personal de DriveMe', account: 'Cuenta de usuario', email: 'Email', role: 'Rol', driverRole: 'Conductor', status: 'Validación administrativa', pending: 'Pendiente', validated: 'Validado', rejected: 'Rechazado', category: 'Categoría profesional', privateDriver: 'Conductor privado', officialTaxi: 'Taxi oficial', touristCarrier: 'Transportista turístico', notDefined: 'No definida', platform: 'Plataforma', driverSpace: 'Espacio de Conductor', rating: 'Nota media', credits: 'Créditos DriveMe', welcomeBonus: 'Bono de bienvenida incluido', security: 'Seguridad', auth: 'Autenticación', conn: 'Conexión', connVal: 'Segura', lastAct: 'Última actividad' }
  };

  closingAccount = false;
  closureError = '';

  readonly closureTexts = {
    FR: {
      title: 'Fermeture du compte',
      explanation: 'Sans historique, votre compte est supprimé. Avec des courses passées, vos informations de profil sont retirées, mais un historique peut subsister. Une course active, un paiement non résolu ou un incident SOS nécessite un traitement préalable.',
      button: 'Fermer mon compte',
      busy: 'Fermeture en cours…',
      confirmation: 'Voulez-vous fermer votre compte ? Cette action est définitive et vous déconnectera si elle réussit.',
      failure: 'La fermeture a échoué. Votre session reste ouverte.'
    },
    EN: {
      title: 'Account closure',
      explanation: 'Without history, your account is deleted. With past rides, profile details are removed, but history may remain. Active rides, unresolved payments or SOS incidents require prior handling.',
      button: 'Close my account',
      busy: 'Closing account…',
      confirmation: 'Close your account? This action is permanent and will sign you out if successful.',
      failure: 'Account closure failed. You remain signed in.'
    },
    AR: {
      title: 'إغلاق الحساب',
      explanation: 'يُحذف الحساب إذا لم يكن له سجل. عند وجود رحلات سابقة، تُزال معلومات الملف الشخصي وقد يبقى السجل. تتطلب الرحلات النشطة والمدفوعات المعلقة وحوادث SOS معالجة مسبقة.',
      button: 'إغلاق حسابي',
      busy: 'جارٍ إغلاق الحساب…',
      confirmation: 'هل تريد إغلاق حسابك؟ هذا الإجراء نهائي وسيتم تسجيل خروجك عند نجاحه.',
      failure: 'تعذر إغلاق الحساب. لا تزال مسجلاً للدخول.'
    },
    ES: {
      title: 'Cierre de cuenta',
      explanation: 'Sin historial, se elimina la cuenta. Con viajes anteriores, se retiran los datos del perfil, pero puede conservarse el historial. Los viajes activos, pagos pendientes o incidentes SOS requieren atención previa.',
      button: 'Cerrar mi cuenta',
      busy: 'Cerrando la cuenta…',
      confirmation: '¿Cerrar tu cuenta? Esta acción es definitiva y cerrará tu sesión si tiene éxito.',
      failure: 'No se pudo cerrar la cuenta. La sesión sigue abierta.'
    }
  };

  constructor(
    public readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public closePassengerAccount(): void {
    if (this.userRole !== 'PASSAGER' || this.closingAccount) return;
    const labels = this.closureTexts[this.currentLang];
    if (!window.confirm(labels.confirmation)) return;

    this.closureError = '';
    this.closingAccount = true;
    this.apiService.deleteCurrentPassager().subscribe({
      next: () => {
        this.authService.logout();
        void this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err: any) => {
        this.closingAccount = false;
        let serverMessage: unknown = err?.error?.message;
        if (typeof err?.error === 'string') {
          try {
            const body = JSON.parse(err.error);
            serverMessage = body?.message;
          } catch {
            serverMessage = undefined;
          }
        }
        this.closureError = typeof serverMessage === 'string' && serverMessage.trim()
          ? serverMessage
          : labels.failure;
        this.cdr.detectChanges();
      }
    });
  }

  public get currentLang(): 'FR' | 'EN' | 'AR' | 'ES' {
    return this.apiService.currentLanguage().toUpperCase() as 'FR' | 'EN' | 'AR' | 'ES';
  }

  public set currentLang(language: 'FR' | 'EN' | 'AR' | 'ES') {
    this.apiService.setLanguage(language.toLowerCase() as 'fr' | 'en' | 'ar' | 'es');
    this.updateDriverLabels(language);
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';
    if (this.userRole === 'CHAUFFEUR' && this.userEmail) {
      this.loadChauffeurProfile();
    }
  }

  private loadChauffeurProfile(): void {
    this.apiService.getCurrentChauffeur().subscribe({
      next: (chauffeur: ChauffeurResponseDTO) => {
        this.chauffeur = chauffeur;
        this.typeChauffeur = chauffeur.typeChauffeur ?? null;
        this.statutValidation = Number(chauffeur.statutValidation ?? 0);
        this.noteMoyenne = Number(chauffeur.noteMoyenne ?? 0);
        this.soldeCredit = Number(chauffeur.soldeCredit ?? 0);
        this.updateDriverLabels(this.currentLang);
        localStorage.setItem('chauffeurNoteMoyenne', String(this.noteMoyenne));
        localStorage.setItem('chauffeurSoldeCredit', String(this.soldeCredit));
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erreur chargement profil chauffeur', err)
    });
  }

  private updateDriverLabels(language: 'FR' | 'EN' | 'AR' | 'ES'): void {
    const labels = this.texts[language];
    switch (this.typeChauffeur) {
      case 'TAXI_OFFICIEL': this.categorieProfessionnelleLabel = labels.officialTaxi; break;
      case 'TRANSPORTEUR_TOURISTIQUE': this.categorieProfessionnelleLabel = labels.touristCarrier; break;
      case 'CHAUFFEUR_PRIVE': this.categorieProfessionnelleLabel = labels.privateDriver; break;
      default: this.categorieProfessionnelleLabel = labels.notDefined;
    }

    switch (this.statutValidation) {
      case 1:
        this.validationAdministrativeLabel = labels.validated;
        this.validationAdministrativeClass = 'success';
        break;
      case 2:
        this.validationAdministrativeLabel = labels.rejected;
        this.validationAdministrativeClass = 'danger';
        break;
      default:
        this.validationAdministrativeLabel = labels.pending;
        this.validationAdministrativeClass = 'pending';
    }
  }
}
