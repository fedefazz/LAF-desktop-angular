import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services';
import { UserRole } from '../models';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const userProfile = userService.userProfile();
  
  if (userProfile && userProfile.role === UserRole.ADMIN) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    // Verificar si el usuario tiene cualquiera de los roles permitidos
    if (userService.hasAnyRole(allowedRoles)) {
      return true;
    } else {
      router.navigate(['/dashboard']);
      return false;
    }
  };
};
