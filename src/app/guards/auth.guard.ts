import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../Services/auth.service';

/**
 * Guard para rutas protegidas.
 * - Permite el acceso si hay sesión activa con el backend.
 * - Redirige a /login si no hay sesión.
 */
export const authGuard: CanActivateFn = () => {
  const auth     = inject(AuthService);
  const router   = inject(Router);
  const platform = inject(PLATFORM_ID);

  // En SSR no hay cookies: devolvemos false para no enviar HTML falso al navegador
  if (!isPlatformBrowser(platform)) {
    return false;
  }

  // Si ya tenemos el usuario en memoria, acceso directo sin petición
  if (auth.isLoggedIn) {
    return true;
  }

  // Verificar sesión real con el backend (/api/auth/me)
  return auth.getMe().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
