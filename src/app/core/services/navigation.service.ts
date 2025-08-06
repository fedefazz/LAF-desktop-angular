import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem, NavigationItem, UserRole } from '../models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  private readonly sidebarOpen = signal<boolean>(true);
  private readonly currentRoute = signal<string>('/');

  // Menu items configuration
  private readonly menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]
    },
    {
      id: 'production',
      label: 'Producción',
      icon: 'precision_manufacturing',
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE],
      children: [
        {
          id: 'machines',
          label: 'Máquinas',
          icon: 'settings',
          route: '/machines',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'products',
          label: 'Productos',
          icon: 'inventory',
          route: '/products',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'operators',
          label: 'Operadores',
          icon: 'engineering',
          route: '/operators',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'scrap',
          label: 'Scrap Manager',
          icon: 'inventory_2',
          route: '/scrap',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        }
      ]
    },
    {
      id: 'materials',
      label: 'Materiales',
      icon: 'category',
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE],
      children: [
        {
          id: 'material-types',
          label: 'Tipos de Material',
          icon: 'inventory',
          route: '/material-types',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        }
      ]
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: 'people',
      route: '/users',
      roles: [UserRole.ADMIN]
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'assessment',
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE],
      children: [
        {
          id: 'reports-scrap',
          label: 'Reportes de Scrap',
          icon: 'analytics',
          route: '/reports/scrap',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'reports-users',
          label: 'Reportes de Usuarios',
          icon: 'people_alt',
          route: '/reports/users',
          roles: [UserRole.ADMIN]
        }
      ]
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: 'settings',
      route: '/settings',
      roles: [UserRole.ADMIN]
    }
  ];

  // Computed signals
  readonly isSidebarOpen = this.sidebarOpen.asReadonly();
  readonly activeRoute = this.currentRoute.asReadonly();

  readonly filteredMenuItems = computed<NavigationItem[]>(() => {
    const userRole = this.userService.userProfile()?.role;
    if (!userRole) return [];

    return this.menuItems
      .filter(item => item.roles.includes(userRole))
      .map(item => ({
        ...item,
        children: item.children?.filter(child => 
          child.roles.includes(userRole)
        ),
        isActive: this.isRouteActive(item.route || ''),
        expanded: false
      }));
  });

  constructor() {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });
  }

  // Methods
  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  setSidebarState(open: boolean): void {
    this.sidebarOpen.set(open);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private isRouteActive(route: string): boolean {
    const currentRoute = this.currentRoute();
    return currentRoute === route || currentRoute.startsWith(route + '/');
  }
}
