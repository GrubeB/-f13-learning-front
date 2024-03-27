import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';
import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs';

export const authorizeGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  return authService.isAuthenticated$().pipe(
    map(isAuthenticated => {
      return isAuthenticated;
    })
  )
};
