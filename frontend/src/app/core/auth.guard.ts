import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Ou ta méthode de vérification

  if (token) {
    return true; // Accès autorisé
  } else {
    router.navigate(['/login']); // Redirection vers le login
    return false; // Accès bloqué
  }
};
