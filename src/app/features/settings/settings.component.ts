import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatDividerModule
  ],
  template: `
    <div class="settings-container">
      <h1>Configuración del Sistema</h1>
      
      <div class="settings-grid">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>account_circle</mat-icon>
              Configuración de Usuario
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>palette</mat-icon>
                <div matListItemTitle>Tema de la aplicación</div>
                <div matListItemLine>Cambiar entre tema claro y oscuro</div>
                <mat-slide-toggle></mat-slide-toggle>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon>notifications</mat-icon>
                <div matListItemTitle>Notificaciones</div>
                <div matListItemLine>Habilitar notificaciones del sistema</div>
                <mat-slide-toggle [checked]="true"></mat-slide-toggle>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon>language</mat-icon>
                <div matListItemTitle>Idioma</div>
                <div matListItemLine>Español (Argentina)</div>
                <button mat-button>Cambiar</button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>security</mat-icon>
              Seguridad
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>lock</mat-icon>
                <div matListItemTitle>Cambiar contraseña</div>
                <div matListItemLine>Actualizar credenciales de acceso</div>
                <button mat-button color="primary">Cambiar</button>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon>logout</mat-icon>
                <div matListItemTitle>Cerrar sesión en otros dispositivos</div>
                <div matListItemLine>Finalizar todas las sesiones activas</div>
                <button mat-button color="warn">Cerrar sesiones</button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>settings</mat-icon>
              Sistema LAF
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>storage</mat-icon>
                <div matListItemTitle>Base de datos</div>
                <div matListItemLine>Configuración de conexión</div>
                <button mat-button>Configurar</button>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon>backup</mat-icon>
                <div matListItemTitle>Respaldos</div>
                <div matListItemLine>Programar respaldos automáticos</div>
                <button mat-button color="primary">Gestionar</button>
              </mat-list-item>
              
              <mat-divider></mat-divider>
              
              <mat-list-item>
                <mat-icon matListItemIcon>info</mat-icon>
                <div matListItemTitle>Información del sistema</div>
                <div matListItemLine>Versión: LAF Desktop v{{ version() }}</div>
                <button mat-button>Ver detalles</button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .settings-card {
      height: fit-content;
    }

    .settings-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-list-item {
      margin-bottom: 8px;
    }
  `]
})
export class SettingsComponent {
  version = signal('1.0.0');
}
