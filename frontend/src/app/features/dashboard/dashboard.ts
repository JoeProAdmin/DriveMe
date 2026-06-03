import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  private router = inject(Router);

  // Équivalent local sécurisé pour pallier l'absence d'un apiService global
  public apiService = {
    currentLanguage: () => 'FR' as 'FR' | 'AR' | 'EN' | 'ES'
  };

  public activeTab = 'overview';

  // Matrice de labels multilingues attendue par les lignes 92, 93, 123... de ton HTML
  public labels = {
    FR: {
      logTitle: 'Journal d\'activité réseau',
      sync: 'Flux synchronisé en direct',
      actionsTitle: 'Raccourcis d\'administration',
      actionVerify: 'Gérer le registre des courses',
      actionHistory: 'Contrôler la flotte de chauffeurs',
      specTitle: 'Architecture de Validation QR Code',
      specDesc: 'Composant d\'infrastructure prêt pour la signature cryptographique des transactions de paiement.'
    },
    AR: {
      logTitle: 'سجل نشاط الشبكة',
      sync: 'تدفق متزامن مباشر',
      actionsTitle: 'اختصارات الإدارة',
      actionVerify: 'إدارة سجل الرحلات',
      actionHistory: 'مراقبة أسطول السائقين',
      specTitle: 'بنية التحقق من رمز QR',
      specDesc: 'مكون البنية التحتية الجاهز للتوقيع التشفيري لمعاملات الدفع.'
    },
    EN: {
      logTitle: 'Network Activity Log',
      sync: 'Live synchronized stream',
      actionsTitle: 'Administration Shortcuts',
      actionVerify: 'Manage ride registry',
      actionHistory: 'Control driver fleet',
      specTitle: 'QR Code Validation Architecture',
      specDesc: 'Infrastructure component ready for cryptographic signing of payment transactions.'
    },
    ES: {
      logTitle: 'Registro de Actividad de Red',
      sync: 'Flujo sincronizado en vivo',
      actionsTitle: 'Atajos de Administración',
      actionVerify: 'Gestionar registro de viajes',
      actionHistory: 'Controlar flota de conductores',
      specTitle: 'Arquitectura de Validación de Código QR',
      specDesc: 'Componente de infraestructura listo para la firma criptográfica de transacciones de pago.'
    }
  };

  public stats = {
    conducteursActifs: 142,
    membresPassagers: 1840,
    trajetsEnCours: 24,
    volumeEchanges: '48,500'
  };

  public recentActivities = [
    { id: 'REQ-9284', type: 'MATCH', text: 'Mise en relation acceptée (Marrakech - Guéliz)', status: 'En cours', color: '#00C853' },
    { id: 'USR-4412', type: 'VERIF', text: 'Validation du profil conducteur (Casablanca)', status: 'Vérifié', color: '#0f172a' },
    { id: 'TX-3102', type: 'CASH', text: 'Échange direct validé par le passager', status: 'Complété', color: '#64748b' }
  ];

  public setTab(tabName: string): void {
    this.activeTab = tabName;
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

// ✅ EXPORT COMPLÉMENTAIRE : Aligne parfaitement l'import de la ligne 4 de ton app.routes.ts
export { DashboardComponent as Dashboard };
