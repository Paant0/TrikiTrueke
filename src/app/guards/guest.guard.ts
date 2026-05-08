import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../Services/auth.service';

/**
 * Guard para rutas de invitado (login/register).
 * - Redirige a /home si ya hay sesión activa (un usuario logueado no debe ver el login).
 * - Permite el acceso si NO hay sesión.
 */
export const guestGuard: CanActivateFn = () => {
  const auth     = inject(AuthService);
  const router   = inject(Router);
  const platform = inject(PLATFORM_ID);

  // En SSR, evitamos renderizar la vista para que el cliente no vea un HTML incorrecto (parpadeo)
  if (!isPlatformBrowser(platform)) {
    return false;
  }

  // Si ya tenemos el usuario en memoria, redirigir a home
  if (auth.isLoggedIn) {
    return router.createUrlTree(['/home']);
  }

  // Verificar con el backend si hay sesión activa
  return auth.getMe().pipe(
    map(() => router.createUrlTree(['/home'])),  // sesión válida → redirigir
    catchError(() => of(true))                   // sin sesión → permitir acceso al login
  );
};
