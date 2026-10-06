import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ChauffeurResponseDTO } from '../../core/api.service';

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

  constructor(public readonly apiService: ApiService, private readonly cdr: ChangeDetectorRef) {}

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
