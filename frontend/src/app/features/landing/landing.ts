import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './landing.html'
})
export class Landing {

  public currentLang: 'FR' | 'EN' | 'AR' | 'ES' = 'FR';

  public isQrModalOpen = false;

  public texts = {

    FR: {
      login: 'Connexion',
      register: 'S\'inscrire',
      badge: 'LE COVOITURAGE DE CONFIANCE AU MAROC',
      title: 'Explorez le Maroc à votre prix. Mettez-vous d\'accord de gré à gré.',
      description: 'Que vous soyez citadin ou voyageur en quête de découvertes culturelles de Marrakech à Tanger, DriveMe réinvente la mobilité nationale.',
      trip: 'Proposer un trajet',
      vehicle: 'Partager mon véhicule'
    },

    EN: {
      login: 'Login',
      register: 'Register',
      badge: 'TRUSTED RIDESHARING IN MOROCCO',
      title: 'Explore Morocco at your own price. Negotiate directly.',
      description: 'Whether you are a resident or a traveler seeking cultural discoveries from Marrakech to Tangier, DriveMe reinvents national mobility.',
      trip: 'Offer a ride',
      vehicle: 'Share my vehicle'
    },

    AR: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      badge: 'النقل التشاركي الموثوق في المغرب',
      title: 'استكشف المغرب بالسعر الذي يناسبك.',
      description: 'سواء كنت مقيماً أو مسافراً لاكتشاف المغرب من مراكش إلى طنجة، فإن DriveMe يعيد ابتكار التنقل.',
      trip: 'عرض رحلة',
      vehicle: 'مشاركة سيارتي'
    },

    ES: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      badge: 'COMPARTIR VIAJES DE CONFIANZA EN MARRUECOS',
      title: 'Explora Marruecos a tu precio.',
      description: 'Ya seas residente o viajero, DriveMe reinventa la movilidad nacional.',
      trip: 'Proponer viaje',
      vehicle: 'Compartir mi vehículo'
    }

  };

  public changeLang(lang: 'FR' | 'EN' | 'AR' | 'ES'): void {
    this.currentLang = lang;
  }

  public ouvrirPopUpQr(): void {
    this.isQrModalOpen = true;
  }

  public fermerPopUpQr(): void {
    this.isQrModalOpen = false;
  }
}
