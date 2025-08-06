import { Injectable, signal, computed, inject } from '@angular/core';
import { User, UserRole, UserProfile } from '../models';
import { AuthService, AuthUser } from './auth.service';
import { IMAGES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly authService = inject(AuthService);

  // Usar el authService como fuente de verdad
  readonly user = this.authService.currentUser;
  readonly loggedIn = this.authService.isAuthenticated;
  
  readonly userProfile = computed<UserProfile | null>(() => {
    const authUser = this.authService.currentUser();
    if (!authUser) return null;
    
    return {
      id: authUser.id,
      username: authUser.username,
      email: authUser.email,
      firstName: authUser.firstName || '',
      lastName: authUser.lastName || '',
      fullName: authUser.fullName || `${authUser.firstName} ${authUser.lastName}`,
      role: this.mapRole(authUser.primaryRole),
      avatar: authUser.avatar || IMAGES.PLACEHOLDERS.USER,
      isActive: authUser.isActive,
      lastLogin: authUser.lastLogin
    };
  });

  // Computed properties para roles específicos
  readonly isAdmin = computed(() => 
    this.userProfile()?.role === UserRole.ADMIN
  );

  readonly isEmployee = computed(() => 
    this.userProfile()?.role === UserRole.EMPLOYEE
  );

  readonly isSuperAdmin = computed(() =>
    this.userProfile()?.role === UserRole.SUPER_ADMIN
  );

  readonly isManager = computed(() =>
    this.userProfile()?.role === UserRole.MANAGER
  );

  // Método para verificar si el usuario tiene un rol específico
  hasRole(role: UserRole): boolean {
    const authUser = this.authService.currentUser();
    return authUser?.roles?.includes(role) || false;
  }

  // Método para verificar si el usuario tiene cualquiera de los roles especificados
  hasAnyRole(roles: UserRole[]): boolean {
    const authUser = this.authService.currentUser();
    return roles.some(role => authUser?.roles?.includes(role)) || false;
  }

  // Obtener todos los roles del usuario
  getUserRoles(): string[] {
    const authUser = this.authService.currentUser();
    return authUser?.roles || [];
  }

  // Methods para compatibilidad
  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  updateUser(updates: Partial<User>): void {
    // TODO: Implementar actualización del usuario en la API
    console.log('updateUser called with:', updates);
  }

  private mapRole(role?: string | string[]): UserRole {
    // Si es un array, tomar el primer rol (o el de mayor jerarquía)
    const roleStr = Array.isArray(role) ? role[0] : role;
    
    switch (roleStr) {
      case 'SuperAdmin':
        return UserRole.SUPER_ADMIN;
      case 'Admin':
        return UserRole.ADMIN;
      case 'Manager':
        return UserRole.MANAGER;
      case 'Employee':
        return UserRole.EMPLOYEE;
      case 'Ingenieria':
        return UserRole.INGENIERIA;
      case 'Producto':
        return UserRole.PRODUCTO;
      case 'Pre Prensa':
        return UserRole.PRE_PRENSA;
      case 'Admin Producto':
        return UserRole.ADMIN_PRODUCTO;
      case 'Herramental':
        return UserRole.HERRAMENTAL;
      default:
        return UserRole.EMPLOYEE;
    }
  }
}
