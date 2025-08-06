import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services';
import { Notification, NotificationType, NotificationPriority } from '../../core/models';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <h1>
          <mat-icon>notifications</mat-icon>
          Notificaciones
        </h1>
        <div class="header-actions">
          <button 
            mat-stroked-button 
            (click)="clearReadNotifications()"
            [disabled]="readNotificationsCount() === 0">
            <mat-icon>delete_sweep</mat-icon>
            Limpiar leídas
          </button>
          <button 
            mat-raised-button 
            color="primary"
            (click)="markAllAsRead()"
            [disabled]="notificationService.unreadCount() === 0">
            <mat-icon>done_all</mat-icon>
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <mat-card class="notifications-card">
        <mat-tab-group class="notification-tabs">
          <!-- All notifications tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>inbox</mat-icon>
              Todas ({{ notificationService.allNotifications().length }})
            </ng-template>
            
            <div class="tab-content">
              @if (notificationService.allNotifications().length === 0) {
                <div class="empty-state">
                  <mat-icon>notifications_none</mat-icon>
                  <h3>No hay notificaciones</h3>
                  <p>Cuando recibas notificaciones, aparecerán aquí.</p>
                </div>
              } @else {
                <mat-list class="notification-list">
                  @for (notification of sortedNotifications(); track notification.id) {
                    <mat-list-item 
                      class="notification-item"
                      [class.notification-unread]="!notification.read"
                      (click)="toggleRead(notification)">
                      
                      <mat-icon 
                        matListItemIcon 
                        [class]="getNotificationIconClass(notification.type)">
                        {{ getNotificationIcon(notification.type) }}
                      </mat-icon>
                      
                      <div matListItemTitle class="notification-content">
                        <div class="notification-header">
                          <span class="notification-title">{{ notification.title }}</span>
                          <div class="notification-meta">
                            <mat-chip 
                              class="priority-chip"
                              [class]="'priority-' + notification.priority">
                              {{ notification.priority }}
                            </mat-chip>
                            <span class="notification-time">
                              {{ formatFullTime(notification.timestamp) }}
                            </span>
                          </div>
                        </div>
                        <p class="notification-message">{{ notification.message }}</p>
                      </div>
                      
                      <div matListItemMeta class="notification-actions">
                        @if (notification.actionUrl) {
                          <button 
                            mat-icon-button 
                            color="primary"
                            matTooltip="{{ notification.actionLabel || 'Ver más' }}"
                            (click)="navigateToAction(notification, $event)">
                            <mat-icon>open_in_new</mat-icon>
                          </button>
                        }
                        
                        @if (!notification.read) {
                          <button 
                            mat-icon-button 
                            matTooltip="Marcar como leída"
                            (click)="markAsRead(notification, $event)">
                            <mat-icon>mark_email_read</mat-icon>
                          </button>
                        }
                        
                        <button 
                          mat-icon-button 
                          color="warn"
                          matTooltip="Eliminar"
                          (click)="removeNotification(notification, $event)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </mat-list-item>
                    
                    @if (!$last) {
                      <mat-divider></mat-divider>
                    }
                  }
                </mat-list>
              }
            </div>
          </mat-tab>

          <!-- Unread notifications tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>markunread</mat-icon>
              Sin leer ({{ notificationService.unreadCount() }})
            </ng-template>
            
            <div class="tab-content">
              @if (notificationService.unreadNotifications().length === 0) {
                <div class="empty-state">
                  <mat-icon>mark_email_read</mat-icon>
                  <h3>¡Todo al día!</h3>
                  <p>No tienes notificaciones sin leer.</p>
                </div>
              } @else {
                <mat-list class="notification-list">
                  @for (notification of notificationService.unreadNotifications(); track notification.id) {
                    <mat-list-item 
                      class="notification-item notification-unread"
                      (click)="toggleRead(notification)">
                      
                      <mat-icon 
                        matListItemIcon 
                        [class]="getNotificationIconClass(notification.type)">
                        {{ getNotificationIcon(notification.type) }}
                      </mat-icon>
                      
                      <div matListItemTitle class="notification-content">
                        <div class="notification-header">
                          <span class="notification-title">{{ notification.title }}</span>
                          <div class="notification-meta">
                            <mat-chip 
                              class="priority-chip"
                              [class]="'priority-' + notification.priority">
                              {{ notification.priority }}
                            </mat-chip>
                            <span class="notification-time">
                              {{ formatFullTime(notification.timestamp) }}
                            </span>
                          </div>
                        </div>
                        <p class="notification-message">{{ notification.message }}</p>
                      </div>
                      
                      <div matListItemMeta class="notification-actions">
                        @if (notification.actionUrl) {
                          <button 
                            mat-icon-button 
                            color="primary"
                            matTooltip="{{ notification.actionLabel || 'Ver más' }}"
                            (click)="navigateToAction(notification, $event)">
                            <mat-icon>open_in_new</mat-icon>
                          </button>
                        }
                        
                        <button 
                          mat-icon-button 
                          matTooltip="Marcar como leída"
                          (click)="markAsRead(notification, $event)">
                          <mat-icon>mark_email_read</mat-icon>
                        </button>
                        
                        <button 
                          mat-icon-button 
                          color="warn"
                          matTooltip="Eliminar"
                          (click)="removeNotification(notification, $event)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </mat-list-item>
                    
                    @if (!$last) {
                      <mat-divider></mat-divider>
                    }
                  }
                </mat-list>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .notifications-page {
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        color: rgba(0, 0, 0, 0.87);
        font-size: 28px;
        font-weight: 400;
      }

      .header-actions {
        display: flex;
        gap: 12px;
      }
    }

    .notifications-card {
      padding: 0;
    }

    .notification-tabs {
      .mat-mdc-tab-label {
        min-width: 150px;
      }
    }

    .tab-content {
      padding: 0;
    }

    .empty-state {
      text-align: center;
      padding: 64px 32px;
      color: rgba(0, 0, 0, 0.6);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        color: rgba(0, 0, 0, 0.3);
      }

      h3 {
        margin: 0 0 8px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.7);
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .notification-list {
      .mat-mdc-list-item {
        --mdc-list-list-item-container-height: auto;
        min-height: 80px;
        padding: 16px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }

        &.notification-unread {
          background-color: rgba(var(--mat-primary-500-rgb), 0.04);
          border-left: 4px solid var(--mat-primary-500);
        }
      }
    }

    .notification-content {
      flex: 1;
      min-width: 0;

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        gap: 16px;
      }

      .notification-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
        line-height: 1.3;
      }

      .notification-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }

      .notification-message {
        margin: 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 1.4;
      }

      .notification-time {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        white-space: nowrap;
      }
    }

    .priority-chip {
      font-size: 10px;
      min-height: 20px;
      font-weight: 600;

      &.priority-low {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      &.priority-medium {
        background-color: #fff3e0;
        color: #f57c00;
      }

      &.priority-high {
        background-color: #ffebee;
        color: #d32f2f;
      }

      &.priority-urgent {
        background-color: #fce4ec;
        color: #c2185b;
        animation: pulse 2s infinite;
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .notification-actions {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    // Icon styles
    .icon-success { color: #4caf50; }
    .icon-error { color: #f44336; }
    .icon-warning { color: #ff9800; }
    .icon-info { color: #2196f3; }
    .icon-system { color: #9c27b0; }

    // Responsive design
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;

        .header-actions {
          align-self: stretch;
          justify-content: space-between;
        }
      }

      .notification-content .notification-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .notification-meta {
        align-self: stretch;
        justify-content: space-between;
      }
    }
  `]
})
export class NotificationsPageComponent {
  readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly sortedNotifications = computed(() =>
    this.notificationService.allNotifications()
      .slice()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  );

  readonly readNotificationsCount = computed(() =>
    this.notificationService.allNotifications().filter(n => n.read).length
  );

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS: return 'check_circle';
      case NotificationType.ERROR: return 'error';
      case NotificationType.WARNING: return 'warning';
      case NotificationType.INFO: return 'info';
      case NotificationType.SYSTEM: return 'settings';
      default: return 'notifications';
    }
  }

  getNotificationIconClass(type: NotificationType): string {
    return `icon-${type}`;
  }

  formatFullTime(timestamp: Date): string {
    return timestamp.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(notification.id);
  }

  navigateToAction(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
      this.notificationService.markAsRead(notification.id);
    }
  }

  removeNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    this.notificationService.removeNotification(notification.id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  clearReadNotifications(): void {
    this.notificationService.clearRead();
  }
}
