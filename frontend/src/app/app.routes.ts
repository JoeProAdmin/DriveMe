import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register'; // 1. Import vital
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCourse } from './features/course/create/create-course';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // 2. Déclaration de la route
  { path: 'dashboard', component: Dashboard },
  { path: 'create-course', component: CreateCourse },
  { path: '**', redirectTo: '' }
];
