import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing {
  public currentLang: 'FR' | 'EN' | 'AR' | 'ES' = 'FR';
  public isLocating = false;
  public detectedLocation = '';

  public searchForm = {
    depart: '',
    destination: '',
    date: '',
    passengers: 1
  };

  public texts = {
    FR: {
      login: 'Connexion',
      register: 'S’inscrire',
      badge: 'Plateforme de mobilité sécurisée au Maroc',
      title: 'Trouvez une course, négociez le prix et voyagez en confiance.',
      description: 'DriveMe met en relation passagers et chauffeurs indépendants avec traçabilité, sécurité, avis, paiements et profils vérifiés.',
      depart: 'Départ',
      destination: 'Destination',
      date: 'Date',
      passengers: 'Passagers',
      locate: 'Utiliser ma position',
      search: 'Rechercher une course',
      driver: 'Devenir chauffeur',
      mapTitle: 'Carte DriveMe',
      mapText: 'Géolocalisation et trajets autour de vous',
      safetyTitle: 'Sécurité DriveMe',
      howTitle: 'Comment ça marche ?'
    },
    EN: {
      login: 'Login',
      register: 'Register',
      badge: 'Secure mobility platform in Morocco',
      title: 'Find a ride, negotiate the price and travel safely.',
      description: 'DriveMe connects passengers and independent drivers with tracking, safety, reviews, payments and verified profiles.',
      depart: 'Departure',
      destination: 'Destination',
      date: 'Date',
      passengers: 'Passengers',
      locate: 'Use my location',
      search: 'Search a ride',
      driver: 'Become a driver',
      mapTitle: 'DriveMe Map',
      mapText: 'Location and nearby rides',
      safetyTitle: 'DriveMe Safety',
      howTitle: 'How it works'
    },
    AR: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      badge: 'منصة تنقل آمنة في المغرب',
      title: 'ابحث عن رحلة، تفاوض على السعر وسافر بثقة.',
      description: 'تربط DriveMe الركاب بالسائقين المستقلين مع التتبع، السلامة، التقييمات، المدفوعات والملفات الموثقة.',
      depart: 'نقطة الانطلاق',
      destination: 'الوجهة',
      date: 'التاريخ',
      passengers: 'الركاب',
      locate: 'استخدام موقعي',
      search: 'البحث عن رحلة',
      driver: 'أصبح سائقاً',
      mapTitle: 'خريطة DriveMe',
      mapText: 'الموقع والرحلات القريبة',
      safetyTitle: 'السلامة في DriveMe',
      howTitle: 'كيف تعمل الخدمة؟'
    },
    ES: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      badge: 'Plataforma de movilidad segura en Marruecos',
      title: 'Encuentra un viaje, negocia el precio y viaja con confianza.',
      description: 'DriveMe conecta pasajeros y conductores independientes con seguimiento, seguridad, opiniones, pagos y perfiles verificados.',
      depart: 'Salida',
      destination: 'Destino',
      date: 'Fecha',
      passengers: 'Pasajeros',
      locate: 'Usar mi ubicación',
      search: 'Buscar viaje',
      driver: 'Ser conductor',
      mapTitle: 'Mapa DriveMe',
      mapText: 'Geolocalización y viajes cercanos',
      safetyTitle: 'Seguridad DriveMe',
      howTitle: 'Cómo funciona'
    }
  };

  public changeLang(lang: 'FR' | 'EN' | 'AR' | 'ES'): void {
    this.currentLang = lang;
  }

  public useLocation(): void {
    this.isLocating = true;

    if (!navigator.geolocation) {
      this.detectedLocation = 'Géolocalisation non disponible';
      this.isLocating = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        this.detectedLocation = 'Position détectée';
        this.searchForm.depart = 'Ma position actuelle';
        this.isLocating = false;
      },
      () => {
        this.detectedLocation = 'Autorisation de localisation refusée';
        this.isLocating = false;
      }
    );
  }
}
