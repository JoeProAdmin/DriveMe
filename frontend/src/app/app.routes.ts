import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout';
import { CreateCourse } from './features/course/create/create-course';

// Importe tes vues spécifiques ici
import { ChauffeurList } from './features/course/list/chauffeur-list';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Route parente pour tout ce qui concerne le dashboard
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: 'chauffeurs', component: ChauffeurList },
      { path: 'create-course', component: CreateCourse },
      // Tu pourras ajouter ici 'passagers', 'courses', etc.
    ]
  },

  { path: '**', redirectTo: '' }
];
