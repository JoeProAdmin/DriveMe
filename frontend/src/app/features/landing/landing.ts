import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type Language = 'FR' | 'EN' | 'AR' | 'ES';

interface LandingCopy {
  navServices: string;
  navSafety: string;
  navDriver: string;
  navHelp: string;
  login: string;
  register: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  departure: string;
  departurePlaceholder: string;
  destination: string;
  destinationPlaceholder: string;
  date: string;
  time: string;
  passengers: string;
  locate: string;
  locating: string;
  search: string;
  popular: string;
  routeCasablanca: string;
  routeRabat: string;
  routeMarrakech: string;
  trustVerified: string;
  trustRides: string;
  trustRating: string;
  visualStatus: string;
  visualTitle: string;
  visualRoute: string;
  visualPriceLabel: string;
  visualDriver: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsDescription: string;
  verifiedTitle: string;
  verifiedText: string;
  pricingTitle: string;
  pricingText: string;
  paymentTitle: string;
  paymentText: string;
  supportTitle: string;
  supportText: string;
  stepsEyebrow: string;
  stepsTitle: string;
  stepOneTitle: string;
  stepOneText: string;
  stepTwoTitle: string;
  stepTwoText: string;
  stepThreeTitle: string;
  stepThreeText: string;
  appEyebrow: string;
  appTitle: string;
  appText: string;
  appFeatureOne: string;
  appFeatureTwo: string;
  appFeatureThree: string;
  downloadOn: string;
  availableOn: string;
  driverCtaTitle: string;
  driverCtaText: string;
  driverCtaButton: string;
  footerDescription: string;
  footerProduct: string;
  footerCompany: string;
  footerLegal: string;
  footerRide: string;
  footerDriver: string;
  footerSafety: string;
  footerAbout: string;
  footerContact: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCopyright: string;
  locationCurrent: string;
  locationDenied: string;
  locationUnavailable: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing {
  public currentLang: Language = 'FR';
  public mobileMenuOpen = false;
  public isLocating = false;
  public locationMessage = '';
  public readonly minDate = new Date().toISOString().split('T')[0];

  public searchForm = {
    departure: '',
    destination: '',
    date: this.minDate,
    time: '09:00',
    passengers: 1
  };

  public readonly languages: Array<{ code: Language; label: string }> = [
    { code: 'FR', label: 'Français' },
    { code: 'EN', label: 'English' },
    { code: 'AR', label: 'العربية' },
    { code: 'ES', label: 'Español' }
  ];

  public readonly copy: Record<Language, LandingCopy> = {
    FR: {
      navServices: 'Services', navSafety: 'Sécurité', navDriver: 'Chauffeurs', navHelp: 'Aide', login: 'Connexion', register: 'Créer un compte',
      eyebrow: 'La mobilité marocaine, simplement', titleLead: 'Votre trajet.', titleAccent: 'Votre prix. Votre liberté.',
      description: 'Réservez un chauffeur vérifié, convenez d’un prix transparent et voyagez partout au Maroc avec une assistance disponible à chaque étape.',
      departure: 'Départ', departurePlaceholder: 'Ex. Maarif, Casablanca', destination: 'Destination', destinationPlaceholder: 'Ex. Agdal, Rabat', date: 'Date', time: 'Heure', passengers: 'Passagers', locate: 'Utiliser ma position', locating: 'Localisation en cours…', search: 'Trouver un chauffeur',
      popular: 'Trajets populaires', routeCasablanca: 'Casablanca → Rabat', routeRabat: 'Rabat → Kénitra', routeMarrakech: 'Marrakech → Essaouira',
      trustVerified: 'Chauffeurs vérifiés', trustRides: 'Courses sécurisées', trustRating: 'Note moyenne',
      visualStatus: 'Chauffeur confirmé', visualTitle: 'Votre course arrive', visualRoute: 'Casablanca · 8 min', visualPriceLabel: 'Prix convenu', visualDriver: 'Yassine · 4,9',
      benefitsEyebrow: 'Pourquoi DriveMe', benefitsTitle: 'Pensé pour voyager avec sérénité', benefitsDescription: 'Une expérience simple et transparente, de la demande de course jusqu’à l’arrivée.',
      verifiedTitle: 'Chauffeurs vérifiés', verifiedText: 'Identité, permis et véhicule contrôlés avant activation du compte chauffeur.',
      pricingTitle: 'Prix transparents', pricingText: 'Proposez votre budget et acceptez une offre claire avant le départ.',
      paymentTitle: 'Paiement flexible', paymentText: 'Payez en espèces ou via votre portefeuille DriveMe selon vos préférences.',
      supportTitle: 'Assistance 24/7', supportText: 'Fonction SOS et accompagnement accessible pendant toute la course.',
      stepsEyebrow: 'Comment ça marche', stepsTitle: 'Une course en trois étapes', stepOneTitle: 'Indiquez votre trajet', stepOneText: 'Saisissez votre départ, votre destination et l’horaire souhaité.', stepTwoTitle: 'Choisissez votre offre', stepTwoText: 'Comparez les chauffeurs, les notes et les prix proposés.', stepThreeTitle: 'Voyagez en confiance', stepThreeText: 'Suivez votre course et partagez votre trajet en temps réel.',
      appEyebrow: 'DriveMe dans votre poche', appTitle: 'Réservez, suivez et gérez vos trajets où que vous soyez.', appText: 'Une application conçue pour le quotidien au Maroc, rapide, multilingue et accessible.', appFeatureOne: 'Suivi du chauffeur en temps réel', appFeatureTwo: 'Historique et reçus centralisés', appFeatureThree: 'Assistance et SOS intégrés', downloadOn: 'Télécharger sur', availableOn: 'Disponible sur',
      driverCtaTitle: 'Vous conduisez au Maroc ?', driverCtaText: 'Développez votre activité avec des demandes qualifiées et gardez la maîtrise de vos horaires.', driverCtaButton: 'Devenir chauffeur',
      footerDescription: 'La plateforme marocaine qui relie passagers et chauffeurs indépendants en toute transparence.', footerProduct: 'Produit', footerCompany: 'Entreprise', footerLegal: 'Légal', footerRide: 'Réserver une course', footerDriver: 'Devenir chauffeur', footerSafety: 'Sécurité', footerAbout: 'À propos', footerContact: 'Contact', footerPrivacy: 'Confidentialité', footerTerms: 'Conditions', footerCopyright: '© 2026 DriveMe.cloud. Tous droits réservés.',
      locationCurrent: 'Ma position actuelle', locationDenied: 'Autorisation de localisation refusée.', locationUnavailable: 'La géolocalisation est indisponible sur cet appareil.'
    },
    EN: {
      navServices: 'Services', navSafety: 'Safety', navDriver: 'Drivers', navHelp: 'Help', login: 'Log in', register: 'Create account',
      eyebrow: 'Moroccan mobility, made simple', titleLead: 'Your ride.', titleAccent: 'Your price. Your freedom.', description: 'Book a verified driver, agree on a transparent price and travel across Morocco with support at every step.',
      departure: 'Departure', departurePlaceholder: 'E.g. Maarif, Casablanca', destination: 'Destination', destinationPlaceholder: 'E.g. Agdal, Rabat', date: 'Date', time: 'Time', passengers: 'Passengers', locate: 'Use my location', locating: 'Locating…', search: 'Find a driver', popular: 'Popular routes', routeCasablanca: 'Casablanca → Rabat', routeRabat: 'Rabat → Kenitra', routeMarrakech: 'Marrakech → Essaouira',
      trustVerified: 'Verified drivers', trustRides: 'Secure rides', trustRating: 'Average rating', visualStatus: 'Driver confirmed', visualTitle: 'Your ride is arriving', visualRoute: 'Casablanca · 8 min', visualPriceLabel: 'Agreed price', visualDriver: 'Yassine · 4.9',
      benefitsEyebrow: 'Why DriveMe', benefitsTitle: 'Built for peace of mind', benefitsDescription: 'A simple, transparent experience from ride request to arrival.', verifiedTitle: 'Verified drivers', verifiedText: 'Identity, licence and vehicle are checked before a driver account is activated.', pricingTitle: 'Transparent pricing', pricingText: 'Suggest your budget and approve a clear offer before departure.', paymentTitle: 'Flexible payment', paymentText: 'Pay cash or use your DriveMe wallet according to your preference.', supportTitle: '24/7 assistance', supportText: 'SOS functionality and support available throughout the ride.',
      stepsEyebrow: 'How it works', stepsTitle: 'A ride in three steps', stepOneTitle: 'Enter your journey', stepOneText: 'Add your departure, destination and preferred time.', stepTwoTitle: 'Choose your offer', stepTwoText: 'Compare drivers, ratings and proposed prices.', stepThreeTitle: 'Travel with confidence', stepThreeText: 'Track your ride and share your journey in real time.',
      appEyebrow: 'DriveMe in your pocket', appTitle: 'Book, track and manage rides wherever you are.', appText: 'An app designed for everyday life in Morocco: fast, multilingual and accessible.', appFeatureOne: 'Real-time driver tracking', appFeatureTwo: 'Centralised history and receipts', appFeatureThree: 'Built-in support and SOS', downloadOn: 'Download on', availableOn: 'Available on', driverCtaTitle: 'Do you drive in Morocco?', driverCtaText: 'Grow your activity with qualified requests while keeping control of your schedule.', driverCtaButton: 'Become a driver',
      footerDescription: 'The Moroccan platform connecting passengers and independent drivers with full transparency.', footerProduct: 'Product', footerCompany: 'Company', footerLegal: 'Legal', footerRide: 'Book a ride', footerDriver: 'Become a driver', footerSafety: 'Safety', footerAbout: 'About', footerContact: 'Contact', footerPrivacy: 'Privacy', footerTerms: 'Terms', footerCopyright: '© 2026 DriveMe.cloud. All rights reserved.', locationCurrent: 'My current location', locationDenied: 'Location permission was denied.', locationUnavailable: 'Geolocation is unavailable on this device.'
    },
    AR: {
      navServices: 'الخدمات', navSafety: 'الأمان', navDriver: 'السائقون', navHelp: 'المساعدة', login: 'تسجيل الدخول', register: 'إنشاء حساب', eyebrow: 'تنقل مغربي بكل بساطة', titleLead: 'رحلتك.', titleAccent: 'سعرك. حريتك.', description: 'احجز مع سائق موثوق، اتفق على سعر واضح وتنقل في جميع أنحاء المغرب مع دعم في كل مرحلة.',
      departure: 'الانطلاق', departurePlaceholder: 'مثال: المعاريف، الدار البيضاء', destination: 'الوجهة', destinationPlaceholder: 'مثال: أكدال، الرباط', date: 'التاريخ', time: 'الوقت', passengers: 'الركاب', locate: 'استخدام موقعي', locating: 'جاري تحديد الموقع…', search: 'البحث عن سائق', popular: 'مسارات شائعة', routeCasablanca: 'الدار البيضاء ← الرباط', routeRabat: 'الرباط ← القنيطرة', routeMarrakech: 'مراكش ← الصويرة',
      trustVerified: 'سائقون موثقون', trustRides: 'رحلات آمنة', trustRating: 'متوسط التقييم', visualStatus: 'تم تأكيد السائق', visualTitle: 'رحلتك في الطريق', visualRoute: 'الدار البيضاء · 8 دقائق', visualPriceLabel: 'السعر المتفق عليه', visualDriver: 'ياسين · 4.9', benefitsEyebrow: 'لماذا DriveMe', benefitsTitle: 'مصمم لراحة بالك', benefitsDescription: 'تجربة بسيطة وشفافة من طلب الرحلة إلى الوصول.', verifiedTitle: 'سائقون موثقون', verifiedText: 'يتم التحقق من الهوية والرخصة والمركبة قبل تفعيل حساب السائق.', pricingTitle: 'أسعار واضحة', pricingText: 'اقترح ميزانيتك واقبل عرضاً واضحاً قبل الانطلاق.', paymentTitle: 'دفع مرن', paymentText: 'ادفع نقداً أو عبر محفظة DriveMe حسب اختيارك.', supportTitle: 'مساعدة على مدار الساعة', supportText: 'خاصية SOS ودعم متاحان طوال الرحلة.',
      stepsEyebrow: 'كيف تعمل الخدمة', stepsTitle: 'رحلة في ثلاث خطوات', stepOneTitle: 'حدد رحلتك', stepOneText: 'أدخل نقطة الانطلاق والوجهة والوقت المناسب.', stepTwoTitle: 'اختر العرض', stepTwoText: 'قارن بين السائقين والتقييمات والأسعار.', stepThreeTitle: 'سافر بثقة', stepThreeText: 'تتبع رحلتك وشارك مسارك في الوقت الفعلي.', appEyebrow: 'DriveMe في جيبك', appTitle: 'احجز وتابع وأدر رحلاتك أينما كنت.', appText: 'تطبيق مصمم للحياة اليومية في المغرب، سريع ومتعدد اللغات وسهل الاستخدام.', appFeatureOne: 'تتبع السائق مباشرة', appFeatureTwo: 'سجل الرحلات والفواتير', appFeatureThree: 'دعم وميزة SOS مدمجان', downloadOn: 'حمّل من', availableOn: 'متوفر على', driverCtaTitle: 'هل تقود في المغرب؟', driverCtaText: 'طوّر نشاطك مع طلبات مؤهلة وتحكم الكامل في أوقات عملك.', driverCtaButton: 'أصبح سائقاً', footerDescription: 'المنصة المغربية التي تربط الركاب بالسائقين المستقلين بكل شفافية.', footerProduct: 'المنتج', footerCompany: 'الشركة', footerLegal: 'قانوني', footerRide: 'احجز رحلة', footerDriver: 'أصبح سائقاً', footerSafety: 'الأمان', footerAbout: 'من نحن', footerContact: 'اتصل بنا', footerPrivacy: 'الخصوصية', footerTerms: 'الشروط', footerCopyright: '© 2026 DriveMe.cloud. جميع الحقوق محفوظة.', locationCurrent: 'موقعي الحالي', locationDenied: 'تم رفض إذن تحديد الموقع.', locationUnavailable: 'تحديد الموقع غير متاح على هذا الجهاز.'
    },
    ES: {
      navServices: 'Servicios', navSafety: 'Seguridad', navDriver: 'Conductores', navHelp: 'Ayuda', login: 'Acceder', register: 'Crear cuenta', eyebrow: 'Movilidad marroquí, sin complicaciones', titleLead: 'Tu trayecto.', titleAccent: 'Tu precio. Tu libertad.', description: 'Reserva un conductor verificado, acuerda un precio transparente y viaja por Marruecos con asistencia en cada etapa.', departure: 'Salida', departurePlaceholder: 'Ej. Maarif, Casablanca', destination: 'Destino', destinationPlaceholder: 'Ej. Agdal, Rabat', date: 'Fecha', time: 'Hora', passengers: 'Pasajeros', locate: 'Usar mi ubicación', locating: 'Localizando…', search: 'Buscar conductor', popular: 'Rutas populares', routeCasablanca: 'Casablanca → Rabat', routeRabat: 'Rabat → Kenitra', routeMarrakech: 'Marrakech → Essaouira', trustVerified: 'Conductores verificados', trustRides: 'Viajes seguros', trustRating: 'Valoración media', visualStatus: 'Conductor confirmado', visualTitle: 'Tu vehículo está llegando', visualRoute: 'Casablanca · 8 min', visualPriceLabel: 'Precio acordado', visualDriver: 'Yassine · 4,9', benefitsEyebrow: 'Por qué DriveMe', benefitsTitle: 'Pensado para viajar tranquilo', benefitsDescription: 'Una experiencia sencilla y transparente desde la solicitud hasta la llegada.', verifiedTitle: 'Conductores verificados', verifiedText: 'Identidad, permiso y vehículo revisados antes de activar la cuenta.', pricingTitle: 'Precios transparentes', pricingText: 'Propón tu presupuesto y acepta una oferta clara antes de salir.', paymentTitle: 'Pago flexible', paymentText: 'Paga en efectivo o mediante tu monedero DriveMe.', supportTitle: 'Asistencia 24/7', supportText: 'Función SOS y acompañamiento durante todo el viaje.', stepsEyebrow: 'Cómo funciona', stepsTitle: 'Un viaje en tres pasos', stepOneTitle: 'Indica tu trayecto', stepOneText: 'Añade salida, destino y horario preferido.', stepTwoTitle: 'Elige tu oferta', stepTwoText: 'Compara conductores, valoraciones y precios.', stepThreeTitle: 'Viaja con confianza', stepThreeText: 'Sigue y comparte tu trayecto en tiempo real.', appEyebrow: 'DriveMe en tu bolsillo', appTitle: 'Reserva, sigue y gestiona tus viajes estés donde estés.', appText: 'Una aplicación rápida, multilingüe y accesible diseñada para Marruecos.', appFeatureOne: 'Seguimiento en tiempo real', appFeatureTwo: 'Historial y recibos centralizados', appFeatureThree: 'Asistencia y SOS integrados', downloadOn: 'Descargar en', availableOn: 'Disponible en', driverCtaTitle: '¿Conduces en Marruecos?', driverCtaText: 'Haz crecer tu actividad con solicitudes cualificadas y controla tus horarios.', driverCtaButton: 'Ser conductor', footerDescription: 'La plataforma marroquí que conecta pasajeros y conductores independientes con transparencia.', footerProduct: 'Producto', footerCompany: 'Empresa', footerLegal: 'Legal', footerRide: 'Reservar viaje', footerDriver: 'Ser conductor', footerSafety: 'Seguridad', footerAbout: 'Acerca de', footerContact: 'Contacto', footerPrivacy: 'Privacidad', footerTerms: 'Condiciones', footerCopyright: '© 2026 DriveMe.cloud. Todos los derechos reservados.', locationCurrent: 'Mi ubicación actual', locationDenied: 'Se rechazó el permiso de ubicación.', locationUnavailable: 'La geolocalización no está disponible en este dispositivo.'
    }
  };

  public get t(): LandingCopy {
    return this.copy[this.currentLang];
  }

  public changeLanguage(language: Language): void {
    this.currentLang = language;
    this.mobileMenuOpen = false;
    this.locationMessage = '';
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  public selectPopularRoute(departure: string, destination: string): void {
    this.searchForm.departure = departure;
    this.searchForm.destination = destination;
    document.querySelector('.booking-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  public useLocation(): void {
    if (this.isLocating) return;

    this.locationMessage = '';
    if (!navigator.geolocation) {
      this.locationMessage = this.t.locationUnavailable;
      return;
    }

    this.isLocating = true;
    navigator.geolocation.getCurrentPosition(
      () => {
        this.searchForm.departure = this.t.locationCurrent;
        this.locationMessage = this.t.locationCurrent;
        this.isLocating = false;
      },
      () => {
        this.locationMessage = this.t.locationDenied;
        this.isLocating = false;
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 }
    );
  }
}
