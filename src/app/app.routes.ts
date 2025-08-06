import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards';
import { UserRole } from './core/models';

export const routes: Routes = [
  // Public routes (authentication)
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Protected routes (require authentication)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'demo',
        loadComponent: () => import('./features/demo/demo-features.component').then(m => m.DemoFeaturesComponent)
      },
      {
        path: 'scrap',
        loadComponent: () => import('./features/scrap/scrap-manager.component').then(m => m.ScrapManagerComponent)
      },
      {
        path: 'machines',
        loadComponent: () => import('./features/machine-management/machine-management.component').then(m => m.MachineManagementComponent)
      },
      {
        path: 'material-types',
        loadComponent: () => import('./features/material-types/material-type-management.component').then(m => m.MaterialTypeManagementComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/product-management.component').then(m => m.ProductManagementComponent)
      },
      {
        path: 'operators',
        loadComponent: () => import('./features/operators/operator-management.component').then(m => m.OperatorManagementComponent)
      },
      {
        path: 'users',
        canActivate: [roleGuard([UserRole.ADMIN])],
        loadComponent: () => import('./features/users/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'reports',
        canActivate: [authGuard],
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        canActivate: [roleGuard([UserRole.ADMIN])],
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications-page.component').then(m => m.NotificationsPageComponent)
      }
    ]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
