import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AuthService } from './Services/auth.service';

function initializeAuth(authService: AuthService, platformId: object) {
  return () => authService.getMe().pipe(
    catchError(() => of(null)) // Si da error (ej. no está logueado), continúa normal
  );
}

function initializeAuthIfBrowser(authService: AuthService, platformId: object) {
  return () => {
    if (!isPlatformBrowser(platformId)) {
      return;
    }

    return authService.getMe().pipe(
      catchError(() => of(null)) // Si da error (ej. no está logueado), continúa normal
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideClientHydration(withEventReplay()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuthIfBrowser,
      deps: [AuthService, PLATFORM_ID],
      multi: true
    }
  ]
};