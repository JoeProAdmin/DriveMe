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
      phDepart: 'Marrakech, Gare ONCF',
      destination: 'Destination',
      phDest: 'Jemaa El Fna, Casablanca...',
      date: 'Date',
      passengers: 'Passagers',
      locate: 'Utiliser ma position',
      locating: 'Localisation en cours...',
      search: 'Rechercher une course',
      driver: 'Devenir chauffeur',
      mapTitle: 'Carte DriveMe',
      mapText: 'Géolocalisation et trajets autour de vous',
      safetyTitle: 'Sécurité DriveMe',
      s1Title: 'Chauffeurs vérifiés', s1Text: 'Permis, identité, assurance et véhicule contrôlés.',
      s2Title: 'SOS intégré', s2Text: 'Accès rapide à l’assistance et aux informations de course.',
      s3Title: 'Prix transparent', s3Text: 'Le passager propose, le chauffeur accepte ou négocie.',
      s4Title: 'Paiement flexible', s4Text: 'Cash prioritaire, wallet chauffeur et moyens locaux marocains.',
      howTitle: 'Comment ça marche ?',
      h1Title: 'Rechercher', h1Text: 'Indiquez départ, destination et date.',
      h2Title: 'Négocier', h2Text: 'Proposez ou acceptez un prix clair.',
      h3Title: 'Voyager', h3Text: 'Suivez la course et gardez une trace.',
      h4Title: 'Évaluer', h4Text: 'Notez le chauffeur et améliorez la confiance.',
      footerText: 'Plateforme de mise en relation entre passagers et chauffeurs indépendants.',
      locDefault: 'Géolocalisation non disponible',
      locSuccess: 'Position détectée',
      locCurrent: 'Ma position actuelle',
      locDenied: 'Autorisation de localisation refusée'
    },
    EN: {
      login: 'Login',
      register: 'Register',
      badge: 'Secure mobility platform in Morocco',
      title: 'Find a ride, negotiate the price and travel safely.',
      description: 'DriveMe connects passengers and independent drivers with tracking, safety, reviews, payments and verified profiles.',
      depart: 'Departure',
      phDepart: 'Marrakech, ONCF Station',
      destination: 'Destination',
      phDest: 'Jemaa El Fna, Casablanca...',
      date: 'Date',
      passengers: 'Passengers',
      locate: 'Use my location',
      locating: 'Locating...',
      search: 'Search a ride',
      driver: 'Become a driver',
      mapTitle: 'DriveMe Map',
      mapText: 'Location and nearby rides',
      safetyTitle: 'DriveMe Safety',
      s1Title: 'Verified drivers', s1Text: 'License, identity, insurance and vehicle checked.',
      s2Title: 'Integrated SOS', s2Text: 'Quick access to assistance and trip information.',
      s3Title: 'Transparent pricing', s3Text: 'Passenger proposes, driver accepts or negotiates.',
      s4Title: 'Flexible payment', s4Text: 'Cash priority, driver wallet and local Moroccan means.',
      howTitle: 'How it works',
      h1Title: 'Search', h1Text: 'Indicate departure, destination and date.',
      h2Title: 'Negotiate', h2Text: 'Propose or accept a clear price.',
      h3Title: 'Travel', h3Text: 'Track the ride and keep a record.',
      h4Title: 'Rate', h4Text: 'Rate the driver and improve trust.',
      footerText: 'Platform connecting passengers and independent drivers.',
      locDefault: 'Geolocation not available',
      locSuccess: 'Position detected',
      locCurrent: 'My current location',
      locDenied: 'Location permission denied'
    },
    AR: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      badge: 'منصة تنقل آمنة في المغرب',
      title: 'ابحث عن رحلة، تفاوض على السعر وسافر بثقة.',
      description: 'تربط DriveMe الركاب بالسائقين المستقلين مع التتبع، السلامة، التقييمات، المدفوعات والملفات الموثقة.',
      depart: 'نقطة الانطلاق',
      phDepart: 'مراكش، محطة القطار',
      destination: 'الوجهة',
      phDest: 'جامع الفنا، الدار البيضاء...',
      date: 'التاريخ',
      passengers: 'الركاب',
      locate: 'استخدام موقعي',
      locating: 'جاري تحديد الموقع...',
      search: 'البحث عن رحلة',
      driver: 'أصبح سائقاً',
      mapTitle: 'خريطة DriveMe',
      mapText: 'الموقع والرحلات القريبة',
      safetyTitle: 'السلامة في DriveMe',
      s1Title: 'سائقون موثقون', s1Text: 'فحص الرخصة، الهوية، التأمين والمركبة.',
      s2Title: 'نظام SOS مدمج', s2Text: 'وصول سريع للمساعدة ومعلومات الرحلة.',
      s3Title: 'أسعار شفافة', s3Text: 'الراكب يقترح والسائق يقبل أو يتفاوض.',
      s4Title: 'دفع مرن', s4Text: 'الأولوية للدفع نقداً، ومحافظ السائقين والوسائل المحلية.',
      howTitle: 'كيف تعمل الخدمة؟',
      h1Title: 'ابحث', h1Text: 'حدد نقطة الانطلاق، الوجهة والتاريخ.',
      h2Title: 'تفاوض', h2Text: 'اقترح أو اقبل سعراً واضحاً.',
      h3Title: 'سافر', h3Text: 'تتبع الرحلة واحتفظ بسجل.',
      h4Title: 'قيم', h4Text: 'قيم السائق لتعزيز الثقة.',
      footerText: 'منصة للربط بين الركاب والسائقين المستقلين.',
      locDefault: 'تحديد الموقع غير متاح',
      locSuccess: 'تم تحديد الموقع',
      locCurrent: 'موقعي الحالي',
      locDenied: 'تم رفض إذن الوصول للموقع'
    },
    ES: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      badge: 'Plataforma de movilidad segura en Marruecos',
      title: 'Encuentra un viaje, negocia el precio y viaja con confianza.',
      description: 'DriveMe conecta pasajeros y conductores independientes con seguimiento, seguridad, opiniones, pagos y perfiles verificados.',
      depart: 'Salida',
      phDepart: 'Marrakech, Estación ONCF',
      destination: 'Destino',
      phDest: 'Jemaa El Fna, Casablanca...',
      date: 'Fecha',
      passengers: 'Pasajeros',
      locate: 'Usar mi ubicación',
      locating: 'Localizando...',
      search: 'Buscar viaje',
      driver: 'Ser conductor',
      mapTitle: 'Mapa DriveMe',
      mapText: 'Geolocalización y viajes cercanos',
      safetyTitle: 'Seguridad DriveMe',
      s1Title: 'Conductores verificados', s1Text: 'Licencia, identidad, seguro y vehículo controlados.',
      s2Title: 'SOS integrado', s2Text: 'Acceso rápido a asistencia e información del viaje.',
      s3Title: 'Precio transparente', s3Text: 'El pasajero propone, el conductor acepta o negocia.',
      s4Title: 'Pago flexible', s4Text: 'Prioridad al efectivo, billetera del conductor y medios locales.',
      howTitle: 'Cómo funciona',
      h1Title: 'Buscar', h1Text: 'Indica salida, destino y fecha.',
      h2Title: 'Negociar', h2Text: 'Propón o acepta un precio claro.',
      h3Title: 'Viajar', h3Text: 'Sigue el viaje y guarda un registro.',
      h4Title: 'Valorar', h4Text: 'Valora al conductor y mejora la confianza.',
      footerText: 'Plataforma que conecta pasajeros y conductores independientes.',
      locDefault: 'Geolocalización no disponible',
      locSuccess: 'Posición detectada',
      locCurrent: 'Mi ubicación actual',
      locDenied: 'Permiso de ubicación denegado'
    }
  };

  public changeLang(lang: 'FR' | 'EN' | 'AR' | 'ES'): void {
    this.currentLang = lang;
  }

  public useLocation(): void {
    this.isLocating = true;
    if (!navigator.geolocation) {
      this.detectedLocation = this.texts[this.currentLang].locDefault;
      this.isLocating = false;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        this.detectedLocation = this.texts[this.currentLang].locSuccess;
        this.searchForm.depart = this.texts[this.currentLang].locCurrent;
        this.isLocating = false;
      },
      () => {
        this.detectedLocation = this.texts[this.currentLang].locDenied;
        this.isLocating = false;
      }
    );
  }
}
