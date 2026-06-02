import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { LoginComponent } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCourse } from './features/course/create/create-course';
import { CourseList } from './features/course/list/course-list';
import { ChauffeurList } from './features/course/list/chauffeur-list';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  // Page d'accueil publique de l'application
  { path: '', component: Landing },

  // Tunnel d'authentification unifié vert et blanc
  { path: 'login', component: LoginComponent },

  // Espace d'administration et de contrôle
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

  // Espace Passager : Formulaire de commande et d'estimation
  { path: 'create-course', component: CreateCourse, canActivate: [authGuard] },

  // Registre de suivi des trajets
  { path: 'courses', component: CourseList, canActivate: [authGuard] },

  // Registre de contrôle de la flotte des conducteurs
  { path: 'chauffeurs', component: ChauffeurList, canActivate: [authGuard] },

  // Redirection automatique de sécurité pour les routes inconnues
  { path: '**', redirectTo: '' }
];
