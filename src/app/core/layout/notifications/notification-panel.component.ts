import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '../../services';
import { Notification, NotificationType } from '../../models';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule
  ],
  template: `
    <!-- Notification Menu Trigger -->
    <button 
      mat-icon-button 
      [matMenuTriggerFor]="notificationMenu"
      matTooltip="Notificaciones"
      [matBadge]="notificationService.unreadCount()"
      [matBadgeHidden]="notificationService.unreadCount() === 0"
      matBadgeColor="warn"
      aria-label="View notifications">
      <mat-icon>notifications</mat-icon>
    </button>

    <!-- Notification Dropdown Menu -->
    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="notification-header" (click)="$event.stopPropagation()">
        <h3>Notificaciones</h3>
        <div class="header-actions">
          @if (notificationService.unreadCount() > 0) {
            <button 
              mat-button 
              class="mark-all-read-btn"
              (click)="markAllAsRead()">
              Marcar todas como leídas
            </button>
          }
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="notification-list" (click)="$event.stopPropagation()">
        @if (recentNotifications().length === 0) {
          <div class="no-notifications">
            <mat-icon>notifications_none</mat-icon>
            <p>No hay notificaciones</p>
          </div>
        } @else {
          @for (notification of recentNotifications(); track notification.id) {
            <div 
              class="notification-item"
              [class.notification-unread]="!notification.read"
              (click)="onNotificationClick(notification)">
              
              <div class="notification-icon">
                <mat-icon [class]="getNotificationIconClass(notification.type)">
                  {{ getNotificationIcon(notification.type) }}
                </mat-icon>
              </div>
              
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-message">{{ notification.message }}</div>
                <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
              </div>
              
              <div class="notification-actions">
                @if (notification.actionUrl) {
                  <button 
                    mat-icon-button 
                    class="action-btn"
                    matTooltip="{{ notification.actionLabel || 'Ver más' }}"
                    (click)="navigateToAction(notification, $event)">
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                }
                
                <button 
                  mat-icon-button 
                  class="dismiss-btn"
                  matTooltip="Descartar"
                  (click)="removeNotification(notification.id, $event)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
            
            @if (!$last) {
              <mat-divider></mat-divider>
            }
          }
        }
      </div>

      <mat-divider></mat-divider>

      <div class="notification-footer" (click)="$event.stopPropagation()">
        <button 
          mat-button 
          class="view-all-btn"
          (click)="viewAllNotifications()">
          Ver todas las notificaciones
        </button>
      </div>
    </mat-menu>
  `,
  styles: [`
    .notification-menu {
      .mat-mdc-menu-panel {
        min-width: 380px;
        max-width: 400px;
        max-height: 500px;
      }
    }

    .notification-header {
      padding: 16px 20px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .mark-all-read-btn {
      font-size: 12px;
      color: var(--mat-primary-500);
    }

    .notification-list {
      max-height: 320px;
      overflow-y: auto;
    }

    .no-notifications {
      text-align: center;
      padding: 32px 20px;
      color: rgba(0, 0, 0, 0.6);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        color: rgba(0, 0, 0, 0.3);
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .notification-item {
      display: flex;
      padding: 12px 20px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &.notification-unread {
        background-color: rgba(var(--mat-primary-500-rgb), 0.04);
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: var(--mat-primary-500);
        }
      }
    }

    .notification-icon {
      margin-right: 12px;
      display: flex;
      align-items: flex-start;
      padding-top: 2px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;

        &.icon-success { color: #4caf50; }
        &.icon-error { color: #f44336; }
        &.icon-warning { color: #ff9800; }
        &.icon-info { color: #2196f3; }
        &.icon-system { color: #9c27b0; }
      }
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .notification-message {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 1.3;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notification-time {
      font-size: 11px;
      color: rgba(0, 0, 0, 0.4);
    }

    .notification-actions {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      margin-left: 8px;

      .mat-mdc-icon-button {
        width: 32px;
        height: 32px;
        
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      .action-btn {
        color: var(--mat-primary-500);
      }

      .dismiss-btn {
        color: rgba(0, 0, 0, 0.4);
      }
    }

    .notification-footer {
      padding: 12px 20px;
      text-align: center;
    }

    .view-all-btn {
      width: 100%;
      color: var(--mat-primary-500);
    }

    // Scrollbar styling
    .notification-list::-webkit-scrollbar {
      width: 4px;
    }

    .notification-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .notification-list::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
  `]
})
export class NotificationPanelComponent {
  readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly recentNotifications = this.notificationService.recentNotifications;

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

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Hace un momento';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `Hace ${minutes} min`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `Hace ${hours}h`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `Hace ${days}d`;
    }
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  navigateToAction(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
      this.notificationService.markAsRead(notification.id);
    }
  }

  removeNotification(notificationId: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.removeNotification(notificationId);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  viewAllNotifications(): void {
    this.router.navigate(['/notifications']);
  }
}
