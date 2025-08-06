import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { API_CONFIG, TokenResponse, LoginRequest, UserInfoResponse, FullUserResponse } from '../config/api.config';
import { NotificationService } from './notification.service';
import { ImageService } from './image.service';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  roles: string[];
  primaryRole?: string;
  isActive: boolean;
  lastLogin?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly imageService = inject(ImageService);

  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Signals para reactive state
  readonly currentUser = signal<AuthUser | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly isInitialized = signal<boolean>(false);

  // Observables para compatibility
  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeAuth();
    // Listen for storage changes (e.g., when interceptor clears token)
    window.addEventListener('storage', (e) => {
      if (e.key === 'access_token' && !e.newValue) {
        this.handleTokenCleared();
      }
    });
  }

  private handleTokenCleared(): void {
    // Token was cleared externally (e.g., by interceptor)
    this.setCurrentUser(null);
    this.setAuthenticated(false);
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    console.log('Initializing auth, token exists:', !!token);
    
    if (token) {
      // Inmediatamente establecer estados para evitar flickering
      this.isAuthenticated.set(true);
      this.isInitialized.set(true);
      
      this.getUserInfo().subscribe({
        next: (user) => {
          console.log('User info loaded successfully:', user);
          this.setCurrentUser(user);
          this.setAuthenticated(true);
        },
        error: (error) => {
          console.error('Error loading user info:', error);
          this.clearAuth();
        }
      });
    } else {
      console.log('No token found, user not authenticated');
      this.isInitialized.set(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    const loginData: LoginRequest = {
      username,
      password,
      grant_type: 'password'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Convertir a form data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    return this.http.post<TokenResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.token}`,
      formData.toString(),
      { headers }
    ).pipe(
      tap(response => {
        if (response.access_token) {
          this.storeToken(response.access_token);
        }
      }),
      switchMap(() => this.getUserInfo()),
      tap((user: AuthUser) => {
        this.setCurrentUser(user);
        this.setAuthenticated(true);
        this.isInitialized.set(true); // Ensure initialization is complete
        this.notificationService.showSuccess(
          'Bienvenido',
          `Hola ${user.firstName || user.username}, has iniciado sesión exitosamente`
        );
      }),
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        let errorMessage = 'Usuario o contraseña incorrectos';
        
        if (error.error?.error_description) {
          errorMessage = error.error.error_description;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.notificationService.showError(
          'Error de autenticación',
          errorMessage
        );
        return of(false);
      })
    );
  }

  logout(): void {
    const token = this.getStoredToken();
    if (token) {
      // Llamar al endpoint de logout de la API
      this.http.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.logout}`, {})
        .subscribe({
          complete: () => {
            this.clearAuth();
            this.router.navigate(['/auth/login']);
          }
        });
    } else {
      this.clearAuth();
      this.router.navigate(['/auth/login']);
    }
  }

  private getUserInfo(): Observable<AuthUser> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserInfoResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.userInfo}`,
      { headers }
    ).pipe(
      switchMap((userInfo: UserInfoResponse) => {
        // Obtener información completa del usuario
        return this.http.get<any>(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users}/${userInfo.Id}`,
          { headers }
        ).pipe(
          map(userDetails => this.mapToAuthUser(userInfo, userDetails))
        );
      }),
      catchError(error => {
        console.error('Error getting user info:', error);
        return throwError(() => error);
      })
    );
  }

  private mapToAuthUser(userInfo: UserInfoResponse, userDetails: FullUserResponse): AuthUser {
    const roles = userDetails?.Role ? userDetails.Role.map(r => r.Name) : [];
    
    // Use ImageService for consistent avatar logic
    const avatarUrl = this.imageService.getAvatarUrl(
      userDetails?.ProfileImagePath, 
      API_CONFIG.baseUrl
    );
    
    return {
      id: userInfo.Id,
      email: userInfo.Email,
      username: userInfo.Email,
      firstName: userDetails?.FirstName || '',
      lastName: userDetails?.LastName || '',
      fullName: userDetails ? `${userDetails.FirstName} ${userDetails.LastName}` : userInfo.Email,
      avatar: avatarUrl,
      roles: roles,
      primaryRole: this.determinePrimaryRole(roles),
      isActive: userDetails?.IsEnabled || true,
      lastLogin: new Date()
    };
  }

  private determinePrimaryRole(roles: string[]): string {
    // Determinar el rol principal basado en jerarquía
    if (roles.includes('SuperAdmin')) return 'SuperAdmin';
    if (roles.includes('Admin')) return 'Admin';
    if (roles.includes('Manager')) return 'Manager';
    if (roles.includes('Admin Producto')) return 'Admin Producto';
    if (roles.includes('Ingenieria')) return 'Ingenieria';
    if (roles.includes('Producto')) return 'Producto';
    if (roles.includes('Pre Prensa')) return 'Pre Prensa';
    if (roles.includes('Herramental')) return 'Herramental';
    if (roles.includes('Employee')) return 'Employee';
    return 'Employee';
  }

  private setCurrentUser(user: AuthUser | null): void {
    this.currentUser.set(user);
    this.currentUserSubject.next(user);
  }

  private setAuthenticated(authenticated: boolean): void {
    this.isAuthenticated.set(authenticated);
    this.isAuthenticatedSubject.next(authenticated);
  }

  private clearAuth(): void {
    const rememberMe = localStorage.getItem('remember_me') === 'true';
    
    // Limpiar el token según la configuración de "Recordarme"
    if (rememberMe) {
      localStorage.removeItem('access_token');
    } else {
      // También limpiar de sessionStorage si se usó
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('access_token');
    }
    
    localStorage.removeItem('remember_me');
    this.setCurrentUser(null);
    this.setAuthenticated(false);
  }

  private storeToken(token: string): void {
    const rememberMe = localStorage.getItem('remember_me') === 'true';
    
    if (rememberMe) {
      // Persistir en localStorage para que dure más tiempo
      localStorage.setItem('access_token', token);
      // Establecer fecha de expiración (30 días)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      localStorage.setItem('token_expiration', expirationDate.toISOString());
    } else {
      // Usar sessionStorage para que expire al cerrar el navegador
      sessionStorage.setItem('access_token', token);
      // También guardar en localStorage como respaldo
      localStorage.setItem('access_token', token);
      // Establecer fecha de expiración más corta (1 día)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
      localStorage.setItem('token_expiration', expirationDate.toISOString());
    }
  }

  private getStoredToken(): string | null {
    // Verificar si el token ha expirado
    const expirationStr = localStorage.getItem('token_expiration');
    if (expirationStr) {
      const expiration = new Date(expirationStr);
      if (new Date() > expiration) {
        console.log('Token expired, clearing auth');
        this.clearAuth();
        return null;
      }
    }
    
    // Intentar obtener el token de sessionStorage primero, luego localStorage
    return sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getStoredToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Public methods for guards and components
  isLoggedIn(): boolean {
    return this.isAuthenticated() && !!this.getStoredToken();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return this.getStoredToken();
  }
}
