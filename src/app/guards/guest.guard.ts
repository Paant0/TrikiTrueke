import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../Services/auth.service';

/**
 * Protección de rutas para usuarios no logueados.
 * - Redirige a /home si ya hay sesión activa.
 * - Permite el acceso si NO hay sesión.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);

  // Renderizado en el cliente para evitar parpadeo
  if (!isPlatformBrowser(platform)) {
    return false;
  }

  // Si ya tenemos el usuario, redirigir a home
  if (auth.isLoggedIn) {
    return router.createUrlTree(['/home']);
  }

  return auth.getMe().pipe(
    map(() => router.createUrlTree(['/home'])),
    catchError(() => of(true))
  );
};
