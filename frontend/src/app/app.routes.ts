import { Routes } from '@angular/router';

import { Landing } from './features/landing/landing';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { CreateCourse } from './features/course/create/create-course';
import { ChauffeurList } from './features/course/list/chauffeur-list';
import { CourseList } from './features/course/list/course-list';
import { PaymentComponent } from './features/dashboard/payment';
import { PassengerManagementComponent } from './features/admin/passenger-management/passenger-management';
import { PaymentManagementComponent } from './features/admin/payment-management/payment-management';
import { ProfileComponent } from './features/profile/profile';
import { SosComponent } from './features/sos/sos';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LEGAL_ROUTES } from './features/legal/legal.routes';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  ...LEGAL_ROUTES,
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'profile', component: ProfileComponent },
      { path: 'profil', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'sos', component: SosComponent },
      {
        path: 'create-course',
        component: CreateCourse,
        canActivate: [roleGuard],
        data: { roles: ['PASSAGER'] }
      },
      {
        path: 'chauffeurs',
        component: ChauffeurList,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'passagers',
        component: PassengerManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'courses',
        component: CourseList,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'CHAUFFEUR', 'PASSAGER'] }
      },
      {
        path: 'paiements',
        component: PaymentManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'recharge',
        component: PaymentComponent,
        canActivate: [roleGuard],
        data: { roles: ['CHAUFFEUR'] }
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
