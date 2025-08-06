import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-scrap-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule
  ],
  template: `
    <div class="scrap-manager">
      <mat-toolbar class="page-header">
        <mat-icon>inventory_2</mat-icon>
        <h1>Scrap Manager</h1>
        <span class="spacer"></span>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Nuevo Scrap
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Gestión de Materiales de Scrap</mat-card-title>
            <mat-card-subtitle>Sistema de control y seguimiento de scrap industrial</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-card">
                <mat-icon class="stat-icon">inventory</mat-icon>
                <div class="stat-content">
                  <h3>Total de Lotes</h3>
                  <p class="stat-number">1,247</p>
                </div>
              </div>
              
              <div class="stat-card">
                <mat-icon class="stat-icon pending">schedule</mat-icon>
                <div class="stat-content">
                  <h3>Pendientes</h3>
                  <p class="stat-number">23</p>
                </div>
              </div>
              
              <div class="stat-card">
                <mat-icon class="stat-icon processed">check_circle</mat-icon>
                <div class="stat-content">
                  <h3>Procesados</h3>
                  <p class="stat-number">1,224</p>
                </div>
              </div>
              
              <div class="stat-card">
                <mat-icon class="stat-icon revenue">attach_money</mat-icon>
                <div class="stat-content">
                  <h3>Valor Total</h3>
                  <p class="stat-number">$842,150</p>
                </div>
              </div>
            </div>

            <div class="features-grid">
              <mat-card class="feature-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar>add_box</mat-icon>
                  <mat-card-title>Registrar Scrap</mat-card-title>
                  <mat-card-subtitle>Nuevo lote de material</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-button color="primary">Registrar</button>
                </mat-card-actions>
              </mat-card>

              <mat-card class="feature-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar>list</mat-icon>
                  <mat-card-title>Lista de Scraps</mat-card-title>
                  <mat-card-subtitle>Ver todos los lotes</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-button color="primary">Ver Lista</button>
                </mat-card-actions>
              </mat-card>

              <mat-card class="feature-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar>analytics</mat-icon>
                  <mat-card-title>Análisis</mat-card-title>
                  <mat-card-subtitle>Estadísticas y reportes</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-button color="primary">Ver Análisis</button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .scrap-manager {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
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
      
      &.pending { color: #ff9800; }
      &.processed { color: #4caf50; }
      &.revenue { color: #2196f3; }
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

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .feature-card {
      transition: transform 0.2s, box-shadow 0.2s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ScrapManagerComponent {}
