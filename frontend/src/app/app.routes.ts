import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCourse } from './features/course/create/create-course';
import { ChauffeurList } from './features/course/list/chauffeur-list';
import { CourseList } from './features/course/list/course-list';
import { PaymentComponent } from './features/dashboard/payment';
import { PassengerViewComponent } from './features/dashboard/passenger-view/passenger-view';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'create-course', component: CreateCourse, canActivate: [authGuard] },
  { path: 'chauffeurs', component: ChauffeurList, canActivate: [authGuard] },
  { path: 'passagers', component: PassengerViewComponent, canActivate: [authGuard] },
  { path: 'courses', component: CourseList, canActivate: [authGuard] },
  { path: 'paiements', component: PaymentComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
