import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services';
import { IMAGES } from '../../core/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-content">
        <!-- Logo -->
        <div class="branding">
          <div class="logo">
            <img [src]="logoPath" alt="Bolsapel" class="logo-image">
          </div>
        </div>

        <!-- Login form -->
        <mat-card class="login-card">
          <mat-card-header>
            <mat-card-title>Iniciar Sesión</mat-card-title>
            <mat-card-subtitle>Accede a tu cuenta del sistema</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
              <!-- Username field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input 
                  matInput 
                  type="email" 
                  formControlName="username"
                  placeholder="Ingresa tu email"
                  autocomplete="username">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                  El email es requerido
                </mat-error>
                <mat-error *ngIf="loginForm.get('username')?.hasError('email')">
                  Ingresa un email válido
                </mat-error>
              </mat-form-field>

              <!-- Password field -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contraseña</mat-label>
                <input 
                  matInput 
                  [type]="hidePassword() ? 'password' : 'text'" 
                  formControlName="password"
                  placeholder="Ingresa tu contraseña"
                  autocomplete="current-password">
                <button 
                  mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="togglePasswordVisibility()"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword()">
                  <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
              </mat-form-field>

              <!-- Remember me -->
              <div class="form-options">
                <mat-checkbox formControlName="rememberMe">
                  Recordarme
                </mat-checkbox>
              </div>

              <!-- Error message -->
              @if (errorMessage()) {
                <div class="error-message">
                  <mat-icon>error</mat-icon>
                  <span>{{ errorMessage() }}</span>
                </div>
              }

              <!-- Login button -->
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                class="login-button full-width"
                [disabled]="loginForm.invalid || isLoading()">
                
                @if (isLoading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  <span>Iniciando sesión...</span>
                } @else {
                  <ng-container>
                    <mat-icon>login</mat-icon>
                    <span>Iniciar Sesión</span>
                  </ng-container>
                }
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Footer -->
        <div class="login-footer">
          <p>&copy; 2025 LAF Desktop - Bolsapel Industrial</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #102379 0%, #0063b0 100%);
      padding: 40px 20px;
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
      pointer-events: none;
    }

    .login-content {
      width: 100%;
      max-width: 450px;
      position: relative;
      z-index: 1;
    }

    .branding {
      text-align: center;
          margin-bottom: -5em;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0px;

      .logo-image {
        width: 272px;
        height: auto;
        object-fit: contain;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
      }
    }

    .login-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 8px 16px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .login-card:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 24px 48px rgba(0, 0, 0, 0.12),
        0 12px 20px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    .login-card mat-card-header {
      padding: 32px 32px 8px 32px;
    }

    .login-card mat-card-title {
      font-size: 28px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .login-card mat-card-subtitle {
      font-size: 16px;
      color: #718096;
      font-weight: 400;
      line-height: 1.5;
    }

    .login-card mat-card-content {
      padding: 24px 32px 32px 32px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .full-width {
      width: 100%;
    }

    .full-width .mat-mdc-form-field {
      width: 100%;
    }

    .full-width .mat-mdc-text-field-wrapper {
      border-radius: 12px;
      background-color: #f8fafc;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .full-width .mat-mdc-text-field-wrapper:hover {
      border-color: #cbd5e0;
      background-color: #ffffff;
    }

    .full-width .mat-mdc-form-field.mat-focused .mat-mdc-text-field-wrapper {
      border-color: #0063b0;
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 99, 176, 0.1);
    }

    .full-width .mat-mdc-form-field-input {
      padding: 16px 16px 16px 48px;
      font-size: 16px;
      line-height: 1.5;
      color: #2d3748;
    }

    .full-width .mat-mdc-form-field-icon-suffix {
      padding-right: 16px;
      color: #a0aec0;
    }

    .form-options {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: -8px 0;
    }

    .form-options .mat-mdc-checkbox {
      --mdc-checkbox-selected-checkmark-color: #ffffff;
      --mdc-checkbox-selected-focus-icon-color: #0063b0;
      --mdc-checkbox-selected-hover-icon-color: #0063b0;
      --mdc-checkbox-selected-icon-color: #0063b0;
      --mdc-checkbox-selected-pressed-icon-color: #0063b0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: rgba(220, 38, 38, 0.1);
      border: 1px solid rgba(220, 38, 38, 0.3);
      border-radius: 8px;
      color: #dc2626;
      font-size: 14px;
      line-height: 1.4;
      margin: -8px 0 8px 0;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #dc2626;
      }
    }

    .login-button {
      height: 56px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #0063b0 0%, #0063b0 100%);
      border: none;
      box-shadow: 
        0 4px 12px rgba(16, 35, 121, 0.4),
        0 2px 4px rgba(16, 35, 121, 0.2);
      transition: all 0.3s ease;
      margin-top: 8px;
      color: #ffffff;

      &:hover:not([disabled]) {
        transform: translateY(-1px);
        box-shadow: 
          0 6px 16px rgba(16, 35, 121, 0.5),
          0 4px 8px rgba(16, 35, 121, 0.3);
      }

      &:active:not([disabled]) {
        transform: translateY(0);
      }

      &[disabled] {
        background: #e2e8f0;
        color: #374151 !important;
        box-shadow: none;

      }

      // Override Material button styles to ensure proper alignment
      ::ng-deep .mdc-button {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 24px !important;
        min-width: unset !important;
        height: 100% !important;
      }

      ::ng-deep .mdc-button__label {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        width: 100% !important;
      }

      ::ng-deep .mdc-button__ripple {
        border-radius: 16px !important;
      }

      mat-spinner {
        --mdc-circular-progress-active-indicator-color: #ffffff;
      }

      mat-icon {
        color: #ffffff !important;
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
        margin: 0 !important;
      }

      span {
        color: #ffffff !important;
        line-height: 1 !important;
        margin: 0 !important;
      }

      // Estilos para estado deshabilitado
      &[disabled] {
        mat-icon {
          color: #374151 !important;
        }

        span {
          color: #374151 !important;
        }
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 32px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 400;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .login-container {
        padding: 20px 16px;
      }

      .login-content {
        max-width: 100%;
      }

      .logo .logo-image {
        width: 238px;
      }

      .login-card mat-card-header {
        padding: 24px 24px 8px 24px;
      }

      .login-card mat-card-title {
        font-size: 24px;
      }

      .login-card mat-card-content {
        padding: 20px 24px 24px 24px;
      }

      .login-form {
        gap: 20px;
      }
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 16px 12px;
      }

      .logo .logo-image {
        width: 204px;
      }

      .login-card mat-card-header {
        padding: 20px 20px 8px 20px;
      }

      .login-card mat-card-content {
        padding: 16px 20px 20px 20px;
      }

      .login-button {
        height: 52px;
        font-size: 15px;
      }
    }

    /* Animation for form fields */
    .full-width {
      animation: slideInUp 0.6s ease-out;
    }

    .full-width:nth-child(1) { animation-delay: 0.1s; }
    .full-width:nth-child(2) { animation-delay: 0.2s; }
    .form-options { animation: slideInUp 0.6s ease-out 0.3s both; }
    .login-button { animation: slideInUp 0.6s ease-out 0.4s both; }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Card entrance animation */
    .login-card {
      animation: cardEntrance 0.8s ease-out;
    }

    @keyframes cardEntrance {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Logo animation */
    .logo {
      animation: logoFloat 0.8s ease-out;
    }

    @keyframes logoFloat {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  // Image paths
  readonly logoPath = IMAGES.LOGO_HORIZONTAL;

  readonly hidePassword = signal(true);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string>('');

  readonly loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  togglePasswordVisibility(): void {
    this.hidePassword.update(hidden => !hidden);
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(''); // Limpiar errores previos
      
      const { username, password, rememberMe } = this.loginForm.value;
      
      // Configurar la persistencia de la sesión según "Recordarme"
      if (rememberMe) {
        // Usar localStorage para persistir por más tiempo
        localStorage.setItem('remember_me', 'true');
      } else {
        // Usar sessionStorage para que expire al cerrar el navegador
        localStorage.setItem('remember_me', 'false');
      }
      
      this.authService.login(username, password).subscribe({
        next: (success) => {
          if (success) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigate([returnUrl]);
          } else {
            this.errorMessage.set('Por favor, verifica tu email y contraseña.');
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Login error:', error);
          
          let message = 'Error al iniciar sesión. Por favor, intenta nuevamente.';
          
          if (error.status === 401) {
            message = 'Por favor, verifica tu email y contraseña.';
          } else if (error.status === 400) {
            message = 'Datos de entrada inválidos.';
          } else if (error.status === 0) {
            message = 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
          } else if (error.error?.error_description) {
            message = error.error.error_description;
          } else if (error.error?.message) {
            message = error.error.message;
          }
          
          this.errorMessage.set(message);
          this.isLoading.set(false);
        }
      });
    }
  }
}
