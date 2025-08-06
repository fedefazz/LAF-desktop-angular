import { Injectable, signal, computed } from '@angular/core';
import { Notification, NotificationType, NotificationPriority } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notifications = signal<Notification[]>([
    // Mock notifications for development
    {
      id: '1',
      title: 'Sistema Actualizado',
      message: 'LAF Desktop ha sido migrado exitosamente a Angular 18',
      type: NotificationType.SUCCESS,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: NotificationPriority.HIGH
    },
    {
      id: '2',
      title: 'Nuevo Scrap Registrado',
      message: 'Se ha registrado un nuevo lote de material de scrap #SC-2025-001',
      type: NotificationType.INFO,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      actionUrl: '/scrap/details/SC-2025-001',
      actionLabel: 'Ver Detalles',
      priority: NotificationPriority.MEDIUM
    },
    {
      id: '3',
      title: 'Mantenimiento Programado',
      message: 'El sistema estará en mantenimiento el próximo domingo de 2:00 a 4:00 AM',
      type: NotificationType.WARNING,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: true,
      priority: NotificationPriority.LOW
    }
  ]);

  // Computed signals
  readonly allNotifications = this.notifications.asReadonly();
  
  readonly unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  readonly unreadNotifications = computed(() =>
    this.notifications().filter(n => !n.read)
  );

  readonly recentNotifications = computed(() =>
    this.notifications()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
  );

  readonly urgentNotifications = computed(() =>
    this.notifications().filter(n => 
      !n.read && n.priority === NotificationPriority.URGENT
    )
  );

  // Methods
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.notifications.update(notifications => [newNotification, ...notifications]);
  }

  markAsRead(notificationId: string): void {
    this.notifications.update(notifications =>
      notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }

  markAllAsRead(): void {
    this.notifications.update(notifications =>
      notifications.map(n => ({ ...n, read: true }))
    );
  }

  removeNotification(notificationId: string): void {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== notificationId)
    );
  }

  clearAll(): void {
    this.notifications.set([]);
  }

  clearRead(): void {
    this.notifications.update(notifications =>
      notifications.filter(n => !n.read)
    );
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods for creating notifications
  showSuccess(title: string, message: string, actionUrl?: string, actionLabel?: string): void {
    this.addNotification({
      title,
      message,
      type: NotificationType.SUCCESS,
      read: false,
      priority: NotificationPriority.MEDIUM,
      actionUrl,
      actionLabel
    });
  }

  showError(title: string, message: string): void {
    this.addNotification({
      title,
      message,
      type: NotificationType.ERROR,
      read: false,
      priority: NotificationPriority.HIGH
    });
  }

  showWarning(title: string, message: string): void {
    this.addNotification({
      title,
      message,
      type: NotificationType.WARNING,
      read: false,
      priority: NotificationPriority.MEDIUM
    });
  }

  showInfo(title: string, message: string, actionUrl?: string, actionLabel?: string): void {
    this.addNotification({
      title,
      message,
      type: NotificationType.INFO,
      read: false,
      priority: NotificationPriority.LOW,
      actionUrl,
      actionLabel
    });
  }
}
