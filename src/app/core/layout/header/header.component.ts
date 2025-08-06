import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { UserService, NavigationService, NotificationService, ThemeService, SearchService, ImageService } from '../../services';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { IMAGES } from '../../constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
    GlobalSearchComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private readonly notificationService = inject(NotificationService);
  private readonly themeService = inject(ThemeService);
  private readonly searchService = inject(SearchService);
  private readonly imageService = inject(ImageService);
  private readonly router = inject(Router);

  // Image paths
  readonly logoPath = IMAGES.LOGO_HORIZONTAL;

  // State for avatar error handling
  readonly avatarError = signal(false);

  // Computed properties
  readonly user = this.userService.userProfile;
  readonly isLoggedIn = this.userService.loggedIn;
  readonly notificationCount = this.notificationService.unreadCount;
  readonly isDarkTheme = this.themeService.isDark;

  // Avatar helpers
  isDefaultAvatar(avatarUrl?: string): boolean {
    return this.imageService.isDefaultAvatar(avatarUrl) || this.avatarError();
  }

  // Methods
  toggleSidebar(): void {
    this.navigationService.toggleSidebar();
  }

  onProfileClick(): void {
    this.router.navigate(['/profile']);
  }

  onSettingsClick(): void {
    this.router.navigate(['/settings']);
  }

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openSearch(): void {
    this.searchService.openSearch();
  }

  onAvatarError(event: ErrorEvent): void {
    // Si hay error cargando la imagen, marcar como error y ocultar
    console.log('Avatar failed to load:', event);
    this.avatarError.set(true);
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.style.display = 'none';
    }
  }

  // Keyboard shortcut for search (Ctrl+K)
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }
}
