import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const router = inject(Router);

  const userRole = localStorage.getItem('userRole');

  const expectedRoles = route.data['roles'] as string[];

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
