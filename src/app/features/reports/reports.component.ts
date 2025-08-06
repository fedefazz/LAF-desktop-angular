import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="reports-container">
      <h1>Módulo de Reportes</h1>
      
      <div class="reports-grid">
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>assessment</mat-icon>
              Reportes de Scrap
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Generación de reportes estadísticos de productos scrap y recuperados.</p>
            <mat-chip-listbox>
              <mat-chip>En desarrollo</mat-chip>
              <mat-chip color="accent">Módulo futuro</mat-chip>
            </mat-chip-listbox>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>Ver Reportes</button>
            <button mat-button color="primary">Generar</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>bar_chart</mat-icon>
              Análisis de Usuarios
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Métricas de actividad y performance del sistema de usuarios.</p>
            <mat-chip-listbox>
              <mat-chip>En desarrollo</mat-chip>
              <mat-chip color="accent">Módulo futuro</mat-chip>
            </mat-chip-listbox>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>Ver Métricas</button>
            <button mat-button color="primary">Exportar</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>trending_up</mat-icon>
              Dashboard Ejecutivo
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Resumen ejecutivo con KPIs principales del sistema LAF.</p>
            <mat-chip-listbox>
              <mat-chip>En desarrollo</mat-chip>
              <mat-chip color="accent">Módulo futuro</mat-chip>
            </mat-chip-listbox>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>Ver Dashboard</button>
            <button mat-button color="primary">Personalizar</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .report-card {
      height: fit-content;
    }

    .report-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-chip-listbox {
      margin: 16px 0;
    }
  `]
})
export class ReportsComponent {
  // Placeholder para futuras funcionalidades
}
