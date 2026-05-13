import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActividadService } from '../services/actividad.service';
import { ActividadDto } from '../models/actividad.model';
import { ActividadEditDialogComponent } from '../actividad-edit-dialog/actividad-edit-dialog.component';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-actividades-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule
  ],
  animations: [
    trigger('tableAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ 
            opacity: 0, 
            transform: 'translateY(20px) scale(0.95)',
            backgroundColor: '#e3f2fd'
          }),
          stagger('80ms', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ 
                opacity: 1, 
                transform: 'translateY(0) scale(1)',
                backgroundColor: 'white'
              })
            )
          ])
        ], { optional: true }),
        query(':leave', [
          stagger('50ms', [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ 
                opacity: 0, 
                transform: 'translateY(-20px) scale(0.8)',
                backgroundColor: '#ffebee'
              })
            )
          ])
        ], { optional: true })
      ])
    ]),
    trigger('rowAnimation', [
      state('in', style({ opacity: 1, transform: 'translateX(0) scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-20px) scale(0.95)' }),
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)')
      ]),
      transition('* => void', [
        animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 0, transform: 'translateX(20px) scale(0.95)' })
        )
      ])
    ])
  ],
  template: `
    <div class="actividades-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon class="page-icon">settings</mat-icon>
            Actividades
          </h1>
          <div class="header-actions">
            <button mat-raised-button class="create-btn" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Nueva Actividad
            </button>
            <button mat-raised-button color="primary" (click)="refresh()" [disabled]="loading">
              <mat-icon>refresh</mat-icon>
              Refrescar
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Card -->
      <div class="stats-section">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">inventory_2</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ actividades.length }}</span>
                <span class="stat-label">Total Actividades</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field class="search-field" appearance="outline">
                <mat-label>Buscar...</mat-label>
                <input matInput [(ngModel)]="searchText" (ngModelChange)="applyFilter()" 
                       placeholder="Buscar por nombre">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Data Table -->
      <div class="table-container">
        <mat-card>
          <mat-card-content class="table-content">
            <div *ngIf="loading" class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
              <span class="loading-text">Cargando actividades...</span>
            </div>
            
            <ng-container *ngIf="!loading">
              <div class="table-wrapper">
                <table mat-table [dataSource]="filteredActividades" class="actividades-table" 
                       [@tableAnimation]="filteredActividades.length">
                  
                  <!-- ID Column -->
                  <ng-container matColumnDef="IdActividad">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let actividad">{{ actividad.IdActividad }}</td>
                  </ng-container>

                  <!-- Descripcion Column -->
                  <ng-container matColumnDef="Descripcion">
                    <th mat-header-cell *matHeaderCellDef>Descripción</th>
                    <td mat-cell *matCellDef="let actividad">
                      <strong>{{ actividad.Descripcion.trim() }}</strong>
                    </td>
                  </ng-container>

                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Acciones</th>
                    <td mat-cell *matCellDef="let actividad" class="actions-cell">
                      <button mat-mini-fab color="primary" 
                              matTooltip="Editar actividad" 
                              (click)="openEditDialog(actividad)" 
                              class="action-btn edit-btn">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-mini-fab color="warn" 
                              matTooltip="Eliminar actividad" 
                              (click)="deleteActividad(actividad)" 
                              class="action-btn delete-btn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                      class="data-row" [@rowAnimation]></tr>
                  
                  <!-- No Data Row -->
                  <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                      <div class="no-data-message">
                        <mat-icon class="no-data-icon">settings</mat-icon>
                        <span>No se encontraron actividades</span>
                        <small *ngIf="searchText">Intente modificar los criterios de búsqueda</small>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </ng-container>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./actividades-list.component.scss']
})
export class ActividadesListComponent implements OnInit {
  private actividadService = inject(ActividadService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  actividades: ActividadDto[] = [];
  filteredActividades: ActividadDto[] = [];
  displayedColumns = ['IdActividad', 'Descripcion', 'actions'];
  searchText = '';
  loading = false;

  ngOnInit(): void {
    this.loadActividades();
  }

  /**
   * Carga todas las actividades desde el servicio
   */
  loadActividades(): void {
    this.loading = true;
    this.actividadService.getActividades().subscribe({
      next: (actividades) => {
        this.actividades = actividades;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar actividades:', error);
        this.snackBar.open('Error al cargar actividades', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  /**
   * Aplica el filtro de búsqueda
   */
  applyFilter(): void {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      this.filteredActividades = this.actividades;
    } else {
      this.filteredActividades = this.actividades.filter(a => 
        a.Descripcion.trim().toLowerCase().includes(search) ||
        a.IdActividad.toString().includes(search)
      );
    }
  }

  /**
   * Refresca la lista de actividades
   */
  refresh(): void {
    this.loadActividades();
  }

  /**
   * Abre el dialog para crear una nueva actividad
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ActividadEditDialogComponent, {
      width: '500px',
      data: { isCreate: true }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.actividadService.createActividad(result).subscribe({
          next: () => {
            this.snackBar.open('Actividad creada exitosamente', 'Cerrar', { duration: 3000 });
            this.loadActividades();
          },
          error: (error) => {
            console.error('Error al crear actividad:', error);
            this.snackBar.open('Error al crear actividad', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  /**
   * Abre el dialog para editar una actividad existente
   */
  openEditDialog(actividad: ActividadDto): void {
    const dialogRef = this.dialog.open(ActividadEditDialogComponent, {
      width: '500px',
      data: { actividad, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.actividadService.updateActividad(actividad.IdActividad, {
          IdActividad: actividad.IdActividad,
          Descripcion: result.Descripcion,
          Habilitada: actividad.Habilitada
        }).subscribe({
          next: () => {
            this.snackBar.open('Actividad actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.loadActividades();
          },
          error: (error) => {
            console.error('Error al actualizar actividad:', error);
            this.snackBar.open('Error al actualizar actividad', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  /**
   * Elimina una actividad con confirmación
   */
  deleteActividad(actividad: ActividadDto): void {
    if (confirm(`¿Está seguro de eliminar la actividad "${actividad.Descripcion}"?`)) {
      this.actividadService.deleteActividad(actividad.IdActividad).subscribe({
        next: () => {
          this.snackBar.open('Actividad eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadActividades();
        },
        error: (error) => {
          console.error('Error al eliminar actividad:', error);
          this.snackBar.open('Error al eliminar actividad', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
