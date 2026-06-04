import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupération du token depuis le stockage local
  const token = localStorage.getItem('token');

  // Si un token existe, on l'ajoute aux headers de la requête
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  // Sinon, on laisse passer la requête telle quelle
  return next(req);
};
