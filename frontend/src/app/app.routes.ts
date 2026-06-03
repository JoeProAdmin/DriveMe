import { Routes } from '@angular/router';

// On importe Landing depuis features
import { Landing } from './features/landing/landing';

// On importe Auth depuis le dossier auth (si features n'est pas dans le chemin)
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';

// On importe le reste
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCourse } from './features/course/create/create-course';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'create-course', component: CreateCourse },
  { path: '**', redirectTo: '' }
];
