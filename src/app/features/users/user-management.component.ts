import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatChipsModule
  ],
  template: `
    <div class="user-management">
      <mat-toolbar class="page-header">
        <mat-icon>people</mat-icon>
        <h1>Gestión de Usuarios</h1>
        <span class="spacer"></span>
        <button mat-raised-button color="primary">
          <mat-icon>person_add</mat-icon>
          Nuevo Usuario
        </button>
      </mat-toolbar>

      <div class="content">
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <mat-icon class="stat-icon">people</mat-icon>
              <div class="stat-content">
                <h3>Total Usuarios</h3>
                <p class="stat-number">47</p>
              </div>
            </div>
            
            <div class="stat-card">
              <mat-icon class="stat-icon active">person</mat-icon>
              <div class="stat-content">
                <h3>Activos</h3>
                <p class="stat-number">42</p>
              </div>
            </div>
            
            <div class="stat-card">
              <mat-icon class="stat-icon admin">admin_panel_settings</mat-icon>
              <div class="stat-content">
                <h3>Administradores</h3>
                <p class="stat-number">5</p>
              </div>
            </div>
            
            <div class="stat-card">
              <mat-icon class="stat-icon employee">badge</mat-icon>
              <div class="stat-content">
                <h3>Empleados</h3>
                <p class="stat-number">42</p>
              </div>
            </div>
          </div>
        </div>

        <mat-card class="users-table-card">
          <mat-card-header>
            <mat-card-title>Lista de Usuarios</mat-card-title>
            <mat-card-subtitle>Gestión completa de usuarios del sistema</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="table-container">
              <table mat-table class="users-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Último Acceso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="user-row">
                    <td>
                      <div class="user-info">
                        <div class="user-avatar">FF</div>
                        <div class="user-details">
                          <span class="user-name">Federico Fazzini</span>
                          <span class="user-username">&#64;fedefazz</span>
                        </div>
                      </div>
                    </td>
                    <td>fede&#64;bolsapel.com</td>
                    <td>
                      <mat-chip class="role-chip admin">Admin</mat-chip>
                    </td>
                    <td>
                      <mat-chip class="status-chip active">Activo</mat-chip>
                    </td>
                    <td>Hace 2 horas</td>
                    <td>
                      <button mat-icon-button color="primary">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button>
                        <mat-icon>more_vert</mat-icon>
                      </button>
                    </td>
                  </tr>
                  
                  <tr class="user-row">
                    <td>
                      <div class="user-info">
                        <div class="user-avatar">MP</div>
                        <div class="user-details">
                          <span class="user-name">María Pérez</span>
                          <span class="user-username">&#64;mperez</span>
                        </div>
                      </div>
                    </td>
                    <td>maria.perez&#64;bolsapel.com</td>
                    <td>
                      <mat-chip class="role-chip employee">Employee</mat-chip>
                    </td>
                    <td>
                      <mat-chip class="status-chip active">Activo</mat-chip>
                    </td>
                    <td>Hace 1 día</td>
                    <td>
                      <button mat-icon-button color="primary">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button>
                        <mat-icon>more_vert</mat-icon>
                      </button>
                    </td>
                  </tr>
                  
                  <tr class="user-row">
                    <td>
                      <div class="user-info">
                        <div class="user-avatar inactive">JG</div>
                        <div class="user-details">
                          <span class="user-name">Juan García</span>
                          <span class="user-username">&#64;jgarcia</span>
                        </div>
                      </div>
                    </td>
                    <td>juan.garcia&#64;bolsapel.com</td>
                    <td>
                      <mat-chip class="role-chip employee">Employee</mat-chip>
                    </td>
                    <td>
                      <mat-chip class="status-chip inactive">Inactivo</mat-chip>
                    </td>
                    <td>Hace 15 días</td>
                    <td>
                      <button mat-icon-button color="primary">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button>
                        <mat-icon>more_vert</mat-icon>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .user-management {
      height: 100%;
    }

    .page-header {
      background: var(--mat-primary-500);
      color: white;
      margin: -24px -24px 24px -24px;
      padding: 0 24px;
      
      h1 {
        margin: 0 0 0 16px;
        font-size: 24px;
        font-weight: 400;
      }
      
      .spacer {
        flex: 1;
      }
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-section {
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background: rgba(var(--mat-primary-500-rgb), 0.04);
      border-radius: 8px;
      border-left: 4px solid var(--mat-primary-500);
    }

    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-right: 16px;
      color: var(--mat-primary-500);
      
      &.active { color: #4caf50; }
      &.admin { color: #ff5722; }
      &.employee { color: #2196f3; }
    }

    .stat-content {
      h3 {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
      }
      
      .stat-number {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .users-table-card {
      .mat-mdc-card-content {
        padding: 0;
      }
    }

    .table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
      
      th {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.6);
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    .user-row {
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--mat-primary-500);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 14px;
      
      &.inactive {
        background: #9e9e9e;
      }
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }

    .user-username {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }

    .role-chip {
      font-size: 11px;
      min-height: 24px;
      
      &.admin {
        background-color: #ffebee;
        color: #c62828;
      }
      
      &.employee {
        background-color: #e3f2fd;
        color: #1565c0;
      }
    }

    .status-chip {
      font-size: 11px;
      min-height: 24px;
      
      &.active {
        background-color: #e8f5e8;
        color: #2e7d32;
      }
      
      &.inactive {
        background-color: #f5f5f5;
        color: #616161;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .table-container {
        font-size: 14px;
      }
      
      .users-table th, .users-table td {
        padding: 12px 8px;
      }
    }
  `]
})
export class UserManagementComponent {}
