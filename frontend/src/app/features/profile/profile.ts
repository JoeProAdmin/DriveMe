import { Component, OnInit } from '@angular/core';
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

  noteMoyenne = Number(localStorage.getItem('chauffeurNoteMoyenne') || 0);
  soldeCredit = Number(localStorage.getItem('chauffeurSoldeCredit') || 0);

  public texts = {
    FR: { title: 'Mon Profil', subtitle: 'Informations personnelles DriveMe', account: 'Compte utilisateur', email: 'Email', role: 'Rôle', status: 'Statut', statusVal: 'Validé', platform: 'Plateforme', driverSpace: 'Espace Chauffeur', rating: 'Note moyenne', credits: 'Crédits DriveMe', security: 'Sécurité', auth: 'Authentification', conn: 'Connexion', connVal: 'Sécurisée', lastAct: 'Dernière activité' },
    EN: { title: 'My Profile', subtitle: 'DriveMe personal information', account: 'User Account', email: 'Email', role: 'Role', status: 'Status', statusVal: 'Validated', platform: 'Platform', driverSpace: 'Driver Space', rating: 'Average Rating', credits: 'DriveMe Credits', security: 'Security', auth: 'Authentication', conn: 'Connection', connVal: 'Secure', lastAct: 'Last activity' },
    AR: { title: 'ملفي الشخصي', subtitle: 'معلومات DriveMe الشخصية', account: 'حساب المستخدم', email: 'البريد الإلكتروني', role: 'الدور', status: 'الحالة', statusVal: 'تم التحقق', platform: 'المنصة', driverSpace: 'فضاء السائق', rating: 'متوسط التقييم', credits: 'رصيد DriveMe', security: 'الأمان', auth: 'المصادقة', conn: 'الاتصال', connVal: 'آمن', lastAct: 'آخر نشاط' },
    ES: { title: 'Mi Perfil', subtitle: 'Información personal de DriveMe', account: 'Cuenta de usuario', email: 'Email', role: 'Rol', status: 'Estado', statusVal: 'Validado', platform: 'Plataforma', driverSpace: 'Espacio de Conductor', rating: 'Nota media', credits: 'Créditos DriveMe', security: 'Seguridad', auth: 'Autenticación', conn: 'Conexión', connVal: 'Segura', lastAct: 'Última actividad' }
  };

  constructor(public readonly apiService: ApiService) {}

  public get currentLang(): 'FR' | 'EN' | 'AR' | 'ES' {
    return this.apiService.currentLanguage().toUpperCase() as 'FR' | 'EN' | 'AR' | 'ES';
  }

  public set currentLang(language: 'FR' | 'EN' | 'AR' | 'ES') {
    this.apiService.setLanguage(language.toLowerCase() as 'fr' | 'en' | 'ar' | 'es');
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';
    if (this.userRole === 'CHAUFFEUR' && this.userEmail) {
      this.loadChauffeurProfile();
    }
  }

  private loadChauffeurProfile(): void {
    this.apiService.getChauffeurByEmail(this.userEmail).subscribe({
      next: (chauffeur: ChauffeurResponseDTO) => {
        this.chauffeur = chauffeur;
        this.noteMoyenne = Number(chauffeur.noteMoyenne ?? 0);
        this.soldeCredit = Number(chauffeur.soldeCredit ?? 0);
        localStorage.setItem('chauffeurNoteMoyenne', String(this.noteMoyenne));
        localStorage.setItem('chauffeurSoldeCredit', String(this.soldeCredit));
      },
      error: (err: any) => console.error('Erreur chargement profil chauffeur', err)
    });
  }
}
