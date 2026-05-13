import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavigationService, AuthService } from '../../services';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Crear un signal para la URL actual
  private readonly currentUrl = signal<string>(this.router.url);

  // Computed properties
  readonly isSidebarOpen = this.navigationService.isSidebarOpen;
  readonly isInitialized = this.authService.isInitialized;
  readonly isAuthenticated = this.authService.isAuthenticated;

  // Debug: log signals and route on every render
  logLayoutState(context: string) {
    // eslint-disable-next-line no-console
    console.log('[MainLayout][DEBUG]', context, {
      initialized: this.isInitialized(),
      authenticated: this.isAuthenticated(),
      currentUrl: this.router.url,
      isAuthRoute: this.isAuthRoute(),
    });
  }

  // Computed property to determine if we should show content
  readonly shouldShowContent = computed(() => {
    const initialized = this.isInitialized();
    this.logLayoutState('shouldShowContent');
    return initialized;
  });

  // Computed property to determine layout type
  readonly shouldShowMainLayout = computed(() => {
    const initialized = this.isInitialized();
    const authenticated = this.isAuthenticated();
    const currentUrl = this.currentUrl();
    const isAuth = currentUrl.startsWith('/auth');
    const result = initialized && authenticated && !isAuth;
    
    console.log('[MainLayout] shouldShowMainLayout:', {
      initialized,
      authenticated, 
      currentUrl,
      isAuth,
      result
    });
    
    return result;
  });

  readonly shouldShowAuthLayout = computed(() => {
    const initialized = this.isInitialized();
    const authenticated = this.isAuthenticated();
    const currentUrl = this.currentUrl();
    const isAuth = currentUrl.startsWith('/auth');
    const result = initialized && (isAuth || !authenticated);
    
    console.log('[MainLayout] shouldShowAuthLayout:', {
      initialized,
      authenticated,
      currentUrl, 
      isAuth,
      result
    });
    
    return result;
  });

  constructor() {
    // Actualizar el signal de URL cuando cambie la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('[MainLayout] Route changed to:', event.url);
      this.currentUrl.set(event.url);
    });
  }

  // Check if current route is an auth route - make it reactive to route changes
  isAuthRoute(): boolean {
    const currentUrl = this.router.url;
    const isAuth = currentUrl.startsWith('/auth');
    console.log('[MainLayout] isAuthRoute check:', { currentUrl, isAuth });
    return isAuth;
  }
}
