import { Routes } from '@angular/router';

export const LEGAL_ROUTES: Routes = [
  {
    path: 'terms',
    loadComponent: () => import('./terms/terms').then((m) => m.TermsComponent),
    title: 'Conditions générales | DriveMe'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy').then((m) => m.PrivacyComponent),
    title: 'Politique de confidentialité | DriveMe'
  },
  { path: 'about', loadComponent: () => import('../public/about').then(m => m.AboutComponent), title: 'À propos | DriveMe' },
  { path: 'contact', loadComponent: () => import('../public/contact').then(m => m.ContactComponent), title: 'Contact | DriveMe' }
];
