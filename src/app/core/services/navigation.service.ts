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

  // Menu items configuration - Estructura igual al LAF Desktop original con iconos Material válidos
  private readonly menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE] // Como el original: hasRole('Admin') || hasRole('Employee')
    },
    {
      id: 'scrap-manager',
      label: 'Scrap Manager',
      icon: 'delete',
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE],
      children: [
        {
          id: 'scrap-list',
          label: 'Listado Scrap',
          icon: 'list_alt',
          route: '/scrap',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'scrap-motives',
          label: 'Motivos Scrap',
          icon: 'help',
          route: '/motivos-scrap',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'scrap-origin',
          label: 'Origen Scrap',
          icon: 'emoji_objects',
          route: '/origen-scrap',
          roles: [UserRole.ADMIN] // Solo Admin como en el original
        },
        {
          id: 'monthly-periods',
          label: 'Periodos Mensuales',
          icon: 'print',
          route: '/periodos-mensuales',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'motive-report',
          label: 'Reporte Motivo',
          icon: 'inbox',
          route: '/reporte-motivo',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'op-tracking',
          label: 'Seg. de OP',
          icon: 'archive',
          route: '/seg-op',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        },
        {
          id: 'op-tracking-date',
          label: 'Seg. de OP x fecha',
          icon: 'today',
          route: '/seg-op-fecha',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE]
        }
      ]
    },
    {
      id: 'empaque',
      label: 'Empaque',
      icon: 'inventory_2',
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE], // Basado en los items hijos
      children: [
        {
          id: 'reporte-romaneo',
          label: 'Reporte Romaneo',
          icon: 'description',
          route: '/reporte-romaneo',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE] // Sin restricción en el original
        },
        {
          id: 'etiquetas',
          label: 'Etiquetas',
          icon: 'label',
          route: '/etiquetas',
          roles: [UserRole.ADMIN] // hasRole('Admin') en el original
        }
      ]
    },
    {
      id: 'equipamiento',
      label: 'Equipamiento',
      icon: 'build',
      roles: [UserRole.ADMIN], // Toda la sección es solo para Admin
      children: [
        {
          id: 'machines',
          label: 'Máquinas',
          icon: 'precision_manufacturing',
          route: '/machines',
          roles: [UserRole.ADMIN]
        },
        {
          id: 'material-types',
          label: 'Tipo de Material',
          icon: 'category',
          route: '/tipo-material',
          roles: [UserRole.ADMIN]
        },
        {
          id: 'jobtrack',
          label: 'JobTrack',
          icon: 'work',
          route: '/jobtrack',
          roles: [UserRole.ADMIN]
        },
        {
          id: 'activities',
          label: 'Actividades',
          icon: 'assignment',
          route: '/actividades',
          roles: [UserRole.ADMIN]
        }
      ]
    },
    {
      id: 'personal',
      label: 'Personal',
      icon: 'group',
      roles: [UserRole.ADMIN], // Toda la sección es solo para Admin
      children: [
        {
          id: 'operators',
          label: 'Operarios',
          icon: 'engineering',
          route: '/operators',
          roles: [UserRole.ADMIN]
        },
        {
          id: 'users',
          label: 'Usuarios',
          icon: 'person',
          route: '/users',
          roles: [UserRole.ADMIN]
        }
      ]
    },
    {
      id: 'productos',
      label: 'Productos',
      icon: 'view_in_ar',
      // Roles complejos: hasRole('Admin') || hasRole('Producto') || hasRole('Pre Prensa') || hasRole('Ingenieria') || hasRole('Herramental')
      roles: [UserRole.ADMIN, UserRole.PRODUCTO, UserRole.PRE_PRENSA, UserRole.INGENIERIA, UserRole.HERRAMENTAL],
      children: [
        {
          id: 'products',
          label: 'Productos',
          icon: 'inventory',
          route: '/products',
          roles: [UserRole.ADMIN, UserRole.PRODUCTO, UserRole.PRE_PRENSA, UserRole.INGENIERIA, UserRole.HERRAMENTAL]
        },
        {
          id: 'products-kpi',
          label: 'KPI productos',
          icon: 'analytics',
          route: '/kpi-productos',
          roles: [UserRole.ADMIN, UserRole.PRODUCTO, UserRole.PRE_PRENSA, UserRole.INGENIERIA, UserRole.HERRAMENTAL]
        },
        {
          id: 'herramental',
          label: 'Reposicion Herramental',
          icon: 'handyman',
          route: '/reposicion-herramental',
          roles: [UserRole.ADMIN, UserRole.PRODUCTO, UserRole.PRE_PRENSA, UserRole.INGENIERIA, UserRole.HERRAMENTAL]
        }
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'assessment',
      roles: [UserRole.ADMIN] // Toda la sección es solo para Admin
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: 'settings',
      roles: [UserRole.ADMIN] // Solo Admin
    }
  ];

  // Computed signals
  readonly isSidebarOpen = this.sidebarOpen.asReadonly();
  readonly activeRoute = this.currentRoute.asReadonly();

  readonly filteredMenuItems = computed<NavigationItem[]>(() => {
    // Usar el UserService para verificar roles
    if (!this.userService.loggedIn()) return [];

    return this.menuItems
      .filter(item => this.userService.hasAnyRole(item.roles))
      .map(item => ({
        ...item,
        children: item.children?.filter(child => 
          this.userService.hasAnyRole(child.roles)
        ),
        isActive: this.isRouteActive(item.route || ''),
        expanded: false
      }))
      .filter(item => {
        // Si un item de grupo no tiene hijos visibles después del filtro, no mostrarlo
        if (item.children) {
          return item.children.length > 0;
        }
        return true;
      });
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

  private isRouteActive(route: string): boolean {
    if (!route) return false;
    const currentPath = this.currentRoute();
    return currentPath === route || currentPath.startsWith(route + '/');
  }

  navigateToItem(item: MenuItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
