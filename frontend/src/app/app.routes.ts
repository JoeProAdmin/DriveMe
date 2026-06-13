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

import { ProfileComponent } from './features/profile/profile';
import { SosComponent } from './features/sos/sos';

import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  { path: '', component: Landing },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },

  {
    path: 'sos',
    component: SosComponent,
    canActivate: [authGuard]
  },

  {
    path: 'create-course',
    component: CreateCourse,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['PASSAGER']
    }
  },

  {
    path: 'chauffeurs',
    component: ChauffeurList,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN']
    }
  },

  {
    path: 'passagers',
    component: PassengerViewComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN']
    }
  },

  {
    path: 'courses',
    component: CourseList,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN', 'CHAUFFEUR', 'PASSAGER']
    }
  },

  {
    path: 'paiements',
    component: PaymentComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN', 'CHAUFFEUR']
    }
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
