import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { SearchService, NotificationService, ThemeService } from '../../core/services';
import { NotificationType, NotificationPriority } from '../../core/models';

@Component({
  selector: 'app-demo-features',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>🚀 Demostración de Funcionalidades LAF Desktop</h1>
        <p>Explora todas las nuevas características implementadas en el sistema</p>
      </div>

      <div class="demo-grid">
        <!-- Search Demo -->
        <mat-card class="demo-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="primary">search</mat-icon>
              Búsqueda Global
            </mat-card-title>
            <mat-card-subtitle>Busca cualquier elemento del sistema</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Prueba la búsqueda global que encuentra usuarios, productos scrap, reportes y configuraciones.</p>
            <mat-chip-listbox>
              <mat-chip color="primary">Ctrl + K</mat-chip>
              <mat-chip>Búsqueda inteligente</mat-chip>
              <mat-chip color="accent">Resultados categorizados</mat-chip>
            </mat-chip-listbox>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="openSearch()">
              <mat-icon>search</mat-icon>
              Probar Búsqueda
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Notifications Demo -->
        <mat-card class="demo-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="accent">notifications</mat-icon>
              Sistema de Notificaciones
            </mat-card-title>
            <mat-card-subtitle>Notificaciones en tiempo real</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Sistema completo de notificaciones con diferentes tipos y prioridades.</p>
            <div class="notification-buttons">
              <button mat-stroked-button color="primary" (click)="sendInfoNotification()">
                <mat-icon>info</mat-icon>
                Info
              </button>
              <button mat-stroked-button color="accent" (click)="sendSuccessNotification()">
                <mat-icon>check_circle</mat-icon>
                Éxito
              </button>
              <button mat-stroked-button color="warn" (click)="sendWarningNotification()">
                <mat-icon>warning</mat-icon>
                Advertencia
              </button>
              <button mat-stroked-button style="color: #f44336;" (click)="sendErrorNotification()">
                <mat-icon>error</mat-icon>
                Error
              </button>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent" (click)="goToNotifications()">
              <mat-icon>list</mat-icon>
              Ver Todas
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Theme Demo -->
        <mat-card class="demo-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="warn">palette</mat-icon>
              Temas Dinámicos
            </mat-card-title>
            <mat-card-subtitle>Cambio entre tema claro y oscuro</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>El sistema soporta cambio dinámico de temas con persistencia de preferencias.</p>
            <mat-chip-listbox>
              <mat-chip>Tema claro</mat-chip>
              <mat-chip color="primary">Tema oscuro</mat-chip>
              <mat-chip color="accent">Persistencia automática</mat-chip>
            </mat-chip-listbox>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="warn" (click)="toggleTheme()">
              <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
              Cambiar Tema
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Navigation Demo -->
        <mat-card class="demo-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="primary">security</mat-icon>
              Navegación por Roles
            </mat-card-title>
            <mat-card-subtitle>Control de acceso basado en roles</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Sistema de navegación inteligente que se adapta según el rol del usuario.</p>
            <mat-list dense>
              <mat-list-item>
                <mat-icon matListItemIcon color="primary">check</mat-icon>
                <span matListItemTitle>Guards de autenticación</span>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon color="primary">check</mat-icon>
                <span matListItemTitle>Control por roles específicos</span>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon color="primary">check</mat-icon>
                <span matListItemTitle>Menú dinámico</span>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="goToUsers()">
              <mat-icon>people</mat-icon>
              Gestión Usuarios
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Modules Demo -->
        <mat-card class="demo-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="accent">apps</mat-icon>
              Módulos del Sistema
            </mat-card-title>
            <mat-card-subtitle>Funcionalidades principales</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Todos los módulos principales del sistema LAF Desktop están implementados.</p>
            <div class="modules-grid">
              <button mat-stroked-button (click)="goToScrap()">
                <mat-icon>inventory</mat-icon>
                Scrap Manager
              </button>
              <button mat-stroked-button (click)="goToReports()">
                <mat-icon>assessment</mat-icon>
                Reportes
              </button>
              <button mat-stroked-button (click)="goToSettings()">
                <mat-icon>settings</mat-icon>
                Configuración
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Dashboard Demo -->
        <mat-card class="demo-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="warn">dashboard</mat-icon>
              Dashboard Mejorado
            </mat-card-title>
            <mat-card-subtitle>Métricas y acciones rápidas</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Dashboard completamente rediseñado con widgets informativos y acciones rápidas.</p>
            <mat-chip-listbox>
              <mat-chip color="primary">Métricas en tiempo real</mat-chip>
              <mat-chip color="accent">Acciones rápidas</mat-chip>
              <mat-chip color="warn">Estado del sistema</mat-chip>
            </mat-chip-listbox>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="warn" (click)="goToDashboard()">
              <mat-icon>dashboard</mat-icon>
              Ver Dashboard
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Technical Info -->
      <mat-card class="tech-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon color="primary">code</mat-icon>
            Información Técnica
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="tech-grid">
            <div class="tech-item">
              <mat-icon color="primary">web</mat-icon>
              <span>Angular 18</span>
            </div>
            <div class="tech-item">
              <mat-icon color="accent">palette</mat-icon>
              <span>Material Design</span>
            </div>
            <div class="tech-item">
              <mat-icon color="warn">speed</mat-icon>
              <span>Signals</span>
            </div>
            <div class="tech-item">
              <mat-icon color="primary">shield</mat-icon>
              <span>TypeScript</span>
            </div>
            <div class="tech-item">
              <mat-icon color="accent">architecture</mat-icon>
              <span>Standalone Components</span>
            </div>
            <div class="tech-item">
              <mat-icon color="warn">security</mat-icon>
              <span>Route Guards</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .demo-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .demo-header h1 {
      font-size: 2.5rem;
      font-weight: 300;
      color: var(--mat-sys-primary);
      margin-bottom: 16px;
    }

    .demo-header p {
      font-size: 1.2rem;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .demo-card {
      border-radius: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .demo-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .demo-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 16px 0;
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin: 16px 0;
    }

    .modules-grid button {
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .tech-card {
      border-radius: 12px;
      background: linear-gradient(135deg, var(--mat-sys-primary-container) 0%, var(--mat-sys-secondary-container) 100%);
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .tech-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-weight: 500;
    }

    mat-chip-listbox {
      margin: 12px 0;
    }

    @media (max-width: 768px) {
      .demo-grid {
        grid-template-columns: 1fr;
      }
      
      .tech-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DemoFeaturesComponent {
  private searchService = inject(SearchService);
  private notificationService = inject(NotificationService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  openSearch(): void {
    this.searchService.openSearch();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  sendInfoNotification(): void {
    this.notificationService.addNotification({
      type: NotificationType.INFO,
      title: 'Información del Sistema',
      message: 'Esta es una notificación informativa de demostración.',
      read: false,
      priority: NotificationPriority.MEDIUM
    });
  }

  sendSuccessNotification(): void {
    this.notificationService.addNotification({
      type: NotificationType.SUCCESS,
      title: 'Operación Exitosa',
      message: 'La operación se completó correctamente.',
      read: false,
      priority: NotificationPriority.LOW
    });
  }

  sendWarningNotification(): void {
    this.notificationService.addNotification({
      type: NotificationType.WARNING,
      title: 'Advertencia del Sistema',
      message: 'Se detectó una situación que requiere atención.',
      read: false,
      priority: NotificationPriority.HIGH
    });
  }

  sendErrorNotification(): void {
    this.notificationService.addNotification({
      type: NotificationType.ERROR,
      title: 'Error Crítico',
      message: 'Se produjo un error que requiere acción inmediata.',
      read: false,
      priority: NotificationPriority.URGENT
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToScrap(): void {
    this.router.navigate(['/scrap']);
  }

  goToUsers(): void {
    this.router.navigate(['/users']);
  }

  goToReports(): void {
    this.router.navigate(['/reports']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }
}
