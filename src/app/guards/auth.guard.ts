import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../Services/auth.service';

/**
 * Protección de rutas protegidas.
 * - Permite el acceso si hay sesión activa.
 * - Redirige a /login si no hay sesión.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);

  // Renderizado en el cliente para evitar parpadeo
  if (!isPlatformBrowser(platform)) {
    return false;
  }

  // Si ya tenemos el usuario, acceso directo
  if (auth.isLoggedIn) {
    return true;
  }

  // Verificar sesión con el backend (/api/auth/me)
  return auth.getMe().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
