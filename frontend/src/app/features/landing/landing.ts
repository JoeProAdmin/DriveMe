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
      login: 'Connexion', register: 'S’inscrire', badge: 'Plateforme de mobilité sécurisée au Maroc',
      title: 'Trouvez une course, négociez le prix et voyagez en confiance.',
      description: 'DriveMe met en relation passagers et chauffeurs indépendants avec traçabilité et sécurité.',
      depart: 'Départ', phDepart: 'Ville de départ', destination: 'Destination', phDest: 'Ville d\'arrivée',
      date: 'Date', passengers: 'Passagers', locate: 'Utiliser ma position', locating: 'Localisation...',
      search: 'Rechercher', driver: 'Devenir chauffeur', mapTitle: 'Carte DriveMe',
      mapText: 'Trajets en temps réel', safetyTitle: 'Sécurité',
      s1Title: 'Vérifiés', s1Text: 'Identité et véhicule contrôlés.',
      s2Title: 'SOS', s2Text: 'Assistance rapide.',
      s3Title: 'Prix', s3Text: 'Négociation directe.',
      s4Title: 'Paiement', s4Text: 'Cash ou Wallet.',
      howTitle: 'Comment ça marche ?', h1Title: 'Rechercher', h1Text: 'Indiquez vos détails.',
      h2Title: 'Négocier', h2Text: 'Proposez votre prix.', h3Title: 'Voyager', h3Text: 'Suivez le trajet.',
      h4Title: 'Évaluer', h4Text: 'Notez le chauffeur.', footerText: 'DriveMe © 2026',
      locDefault: 'Non disponible', locSuccess: 'Position détectée', locCurrent: 'Ma position', locDenied: 'Refusé'
    },
    EN: {
      login: 'Login', register: 'Register', badge: 'Secure mobility platform in Morocco',
      title: 'Find a ride, negotiate the price and travel safely.',
      description: 'DriveMe connects passengers and independent drivers with full traceability.',
      depart: 'Departure', phDepart: 'Departure city', destination: 'Destination', phDest: 'Arrival city',
      date: 'Date', passengers: 'Passengers', locate: 'Use my location', locating: 'Locating...',
      search: 'Search', driver: 'Become a driver', mapTitle: 'DriveMe Map',
      mapText: 'Real-time routes', safetyTitle: 'Safety',
      s1Title: 'Verified', s1Text: 'Identity and vehicle checked.',
      s2Title: 'SOS', s2Text: 'Quick assistance.',
      s3Title: 'Price', s3Text: 'Direct negotiation.',
      s4Title: 'Payment', s4Text: 'Cash or Wallet.',
      howTitle: 'How it works', h1Title: 'Search', h1Text: 'Enter your details.',
      h2Title: 'Negotiate', h2Text: 'Propose your price.', h3Title: 'Travel', h3Text: 'Track your ride.',
      h4Title: 'Rate', h4Text: 'Rate the driver.', footerText: 'DriveMe © 2026',
      locDefault: 'Not available', locSuccess: 'Position detected', locCurrent: 'My location', locDenied: 'Denied'
    },
    AR: {
      login: 'دخول', register: 'تسجيل', badge: 'منصة تنقل آمنة في المغرب',
      title: 'ابحث عن رحلة، تفاوض على السعر وسافر بثقة.',
      description: 'تربط DriveMe الركاب بالسائقين المستقلين بكل أمان.',
      depart: 'الانطلاق', phDepart: 'مدينة الانطلاق', destination: 'الوجهة', phDest: 'مدينة الوصول',
      date: 'التاريخ', passengers: 'الركاب', locate: 'استخدام موقعي', locating: 'جاري التحديد...',
      search: 'بحث', driver: 'أصبح سائقاً', mapTitle: 'خريطة DriveMe',
      mapText: 'الرحلات في الوقت الفعلي', safetyTitle: 'الأمان',
      s1Title: 'موثقون', s1Text: 'تم فحص الهوية والمركبة.',
      s2Title: 'SOS', s2Text: 'مساعدة سريعة.',
      s3Title: 'السعر', s3Text: 'تفاوض مباشر.',
      s4Title: 'الدفع', s4Text: 'نقداً أو عبر المحفظة.',
      howTitle: 'كيف تعمل الخدمة؟', h1Title: 'بحث', h1Text: 'أدخل تفاصيل رحلتك.',
      h2Title: 'تفاوض', h2Text: 'اقترح سعرك.', h3Title: 'سفر', h3Text: 'تتبع الرحلة.',
      h4Title: 'تقييم', h4Text: 'قيم السائق.', footerText: 'DriveMe © 2026',
      locDefault: 'غير متاح', locSuccess: 'تم تحديد الموقع', locCurrent: 'موقعي', locDenied: 'مرفوض'
    },
    ES: {
      login: 'Acceso', register: 'Registro', badge: 'Plataforma de movilidad segura en Marruecos',
      title: 'Encuentra un viaje, negocia el precio y viaja con confianza.',
      description: 'DriveMe conecta pasajeros y conductores con total seguridad.',
      depart: 'Salida', phDepart: 'Ciudad de salida', destination: 'Destino', phDest: 'Ciudad de llegada',
      date: 'Fecha', passengers: 'Pasajeros', locate: 'Usar mi ubicación', locating: 'Localizando...',
      search: 'Buscar', driver: 'Ser conductor', mapTitle: 'Mapa DriveMe',
      mapText: 'Rutas en tiempo real', safetyTitle: 'Seguridad',
      s1Title: 'Verificados', s1Text: 'Identidad y vehículo revisados.',
      s2Title: 'SOS', s2Text: 'Asistencia rápida.',
      s3Title: 'Precio', s3Text: 'Negociación directa.',
      s4Title: 'Pago', s4Text: 'Efectivo o Wallet.',
      howTitle: 'Cómo funciona', h1Title: 'Buscar', h1Text: 'Ingresa tus detalles.',
      h2Title: 'Negociar', h2Text: 'Propón tu precio.', h3Title: 'Viajar', h3Text: 'Sigue tu ruta.',
      h4Title: 'Valorar', h4Text: 'Califica al conductor.', footerText: 'DriveMe © 2026',
      locDefault: 'No disponible', locSuccess: 'Posición detectada', locCurrent: 'Mi ubicación', locDenied: 'Denegado'
    }
  };

  public changeLang(lang: 'FR' | 'EN' | 'AR' | 'ES'): void { this.currentLang = lang; }

  public useLocation(): void {
    this.isLocating = true;
    if (!navigator.geolocation) {
      this.detectedLocation = this.texts[this.currentLang].locDefault;
      this.isLocating = false;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => { this.detectedLocation = this.texts[this.currentLang].locSuccess; this.searchForm.depart = this.texts[this.currentLang].locCurrent; this.isLocating = false; },
      () => { this.detectedLocation = this.texts[this.currentLang].locDenied; this.isLocating = false; }
    );
  }
}
