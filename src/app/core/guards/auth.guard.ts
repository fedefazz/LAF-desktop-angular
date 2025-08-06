import { inject } from '@angular/core';
import { CanActivateFn, Router, GuardResult } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está inicializado, verificar inmediatamente
  if (authService.isInitialized()) {
    if (authService.isLoggedIn()) {
      return true;
    } else {
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  // Si no está inicializado, esperar hasta que se complete la inicialización
  return new Observable<GuardResult>(observer => {
    const checkAuth = () => {
      if (authService.isInitialized()) {
        if (authService.isLoggedIn()) {
          observer.next(true);
        } else {
          router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
          observer.next(false);
        }
        observer.complete();
      } else {
        // Esperar un poco más
        setTimeout(checkAuth, 50);
      }
    };
    checkAuth();
  }).pipe(take(1));
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está inicializado, verificar inmediatamente
  if (authService.isInitialized()) {
    if (!authService.isLoggedIn()) {
      return true;
    } else {
      router.navigate(['/dashboard']);
      return false;
    }
  }

  // Si no está inicializado, esperar hasta que se complete la inicialización
  return new Observable<GuardResult>(observer => {
    const checkAuth = () => {
      if (authService.isInitialized()) {
        if (!authService.isLoggedIn()) {
          observer.next(true);
        } else {
          router.navigate(['/dashboard']);
          observer.next(false);
        }
        observer.complete();
      } else {
        // Esperar un poco más
        setTimeout(checkAuth, 50);
      }
    };
    checkAuth();
  }).pipe(take(1));
};
