import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotivoScrapEditDialogComponent } from './motivo-scrap-edit-dialog.component';
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
import { MotivoScrapService } from '../../modules/scrap/services/motivo-scrap.service';
import { MotivoScrapDto } from '../../modules/scrap/models/motivo-scrap.model';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-motivos-scrap',
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
    <div class="scrap-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon class="page-icon">inventory_2</mat-icon>
            Motivos de Scrap
          </h1>
          <div class="header-actions">
            <button mat-raised-button class="create-motivo-btn" (click)="openCrearMotivo()">
              <mat-icon>add</mat-icon>
              Crear motivo
            </button>
            <button mat-raised-button color="primary" (click)="loadMotivos()" [disabled]="loading">
              <mat-icon>refresh</mat-icon>
              Refrescar
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field class="search-field" appearance="outline">
                <mat-label>Buscar...</mat-label>
                <input matInput [(ngModel)]="search" (ngModelChange)="applyFilter()" placeholder="Buscar en todos los campos">
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
              <span class="loading-text">Cargando motivos...</span>
            </div>
            <ng-container *ngIf="!loading">
              <div class="table-wrapper">
                <table mat-table [dataSource]="filteredMotivos" class="scrap-table" [@tableAnimation]="filteredMotivos.length">
                  <ng-container matColumnDef="Id_Motivo">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                    <td mat-cell *matCellDef="let m">{{m.Id_Motivo}}</td>
                  </ng-container>
                  <ng-container matColumnDef="Descripcion">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
                    <td mat-cell *matCellDef="let m">{{m.Descripcion}}</td>
                  </ng-container>
                  <ng-container matColumnDef="Habilitado">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Habilitado</th>
                    <td mat-cell *matCellDef="let m">{{m.Habilitado ? 'Sí' : 'No'}}</td>
                  </ng-container>
                  <ng-container matColumnDef="PorcentajeSimulacionMejora">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>% Mejora</th>
                    <td mat-cell *matCellDef="let m">{{m.PorcentajeSimulacionMejora}}</td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Acciones</th>
                    <td mat-cell *matCellDef="let m" class="actions-cell">
                      <button mat-mini-fab color="primary" matTooltip="Editar motivo" (click)="openEditarMotivo(m)" class="action-btn edit-btn">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-mini-fab color="warn" matTooltip="Eliminar motivo" (click)="eliminarMotivo(m)" class="action-btn delete-btn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="data-row" [@rowAnimation]></tr>
                  <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                      <div class="no-data-message">
                        <mat-icon class="no-data-icon">inventory_2</mat-icon>
                        <span>No se encontraron motivos</span>
                        <small *ngIf="search">Intente modificar los criterios de búsqueda</small>
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
  styleUrls: [
    '../../modules/scrap/components/scrap-list.component.scss'
  ],
  styles: [`
    .scrap-container {
      background: linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%) !important;
    }
    .table-content {
      background: #fff !important;
      border-radius: 10px !important;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10) !important;
    }
    .page-header {
      background: #1976d2 !important;
      color: #fff !important;
    }
    .header-actions button.create-motivo-btn {
      background: #fff !important;
      color: #1976d2 !important;
      border: 2px solid #1976d2 !important;
      font-weight: 600;
      box-shadow: none !important;
      transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1) !important;
      transform: scale(1) !important;
    }
    .header-actions button.create-motivo-btn:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
    }
    .header-actions button.create-motivo-btn:active {
      transform: scale(0.95) !important;
    }
    .header-actions button.create-motivo-btn mat-icon {
      color: #1976d2 !important;
    }
    
    /* Animaciones para la tabla */
    .scrap-table .mat-mdc-row {
      transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1) !important;
      opacity: 1 !important;
      transform: translateX(0) scale(1) !important;
    }
    
    .scrap-table .mat-mdc-row:hover {
      background-color: #f5f7fa !important;
      transform: translateX(3px) scale(1.01) !important;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15) !important;
    }
    
    /* Estilos mejorados para los botones de acciones */
    .scrap-table .actions-cell {
      text-align: center !important;
      padding: 8px !important;
    }
    
    .scrap-table .actions-cell .action-btn {
      margin: 0 4px !important;
      width: 32px !important;
      height: 32px !important;
      min-height: 32px !important;
      line-height: 32px !important;
      transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1) !important;
      transform: scale(1) !important;
    }
    
    .scrap-table .actions-cell .action-btn:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
    
    .scrap-table .actions-cell .action-btn:active {
      transform: scale(0.95) !important;
    }
    
    .scrap-table .actions-cell .edit-btn {
      background-color: #1976d2 !important;
      color: white !important;
    }
    
    .scrap-table .actions-cell .delete-btn {
      background-color: #d32f2f !important;
      color: white !important;
    }
    
    .scrap-table .actions-cell .action-btn mat-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
    }
    
    /* Animación para filas nuevas */
    .scrap-table .mat-mdc-row.new-row {
      background: linear-gradient(90deg, #e3f2fd, #bbdefb, white) !important;
      animation: highlightNewMotivo 2s ease-out !important;
    }
    
    @keyframes highlightNewMotivo {
      0% { 
        background: #e3f2fd !important; 
        transform: translateX(-30px) scale(0.95) !important;
        opacity: 0 !important;
      }
      50% { 
        background: #bbdefb !important; 
        transform: translateX(0) scale(1.02) !important;
        opacity: 1 !important;
      }
      100% { 
        background: white !important; 
        transform: translateX(0) scale(1) !important;
        opacity: 1 !important;
      }
    }
  `]
})
export class MotivosScrapComponent implements OnInit {
  motivos: MotivoScrapDto[] = [];
  filteredMotivos: MotivoScrapDto[] = [];
  displayedColumns = ['Id_Motivo', 'Descripcion', 'Habilitado', 'PorcentajeSimulacionMejora', 'actions'];
  search = '';
  loading = false;
  private motivoService = inject(MotivoScrapService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  openCrearMotivo() {
    const dialogRef = this.dialog.open(MotivoScrapEditDialogComponent, {
      width: '900px',
      height: '75vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { isCreate: true },
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Llamar al endpoint real para crear
        this.motivoService.createMotivo(result).subscribe({
          next: (response) => {
            console.log('Motivo creado exitosamente:', response);
            // Recargar la lista para obtener el motivo con su ID asignado
            this.loadMotivos();
            this.snackBar.open('Motivo creado exitosamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al crear motivo:', error);
            this.snackBar.open('Error al crear motivo', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  ngOnInit() {
    this.loadMotivos();
  }

  openEditarMotivo(motivo: MotivoScrapDto) {
    const dialogRef = this.dialog.open(MotivoScrapEditDialogComponent, {
      width: '1200px',
      height: '85vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { motivo, isEdit: true },
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Llamar al endpoint real para actualizar
        const motivoActualizado = { ...motivo, ...result };
        this.motivoService.updateMotivo(motivoActualizado).subscribe({
          next: (response) => {
            console.log('Motivo actualizado exitosamente:', response);
            // Actualizar el motivo en la lista local
            this.motivos = this.motivos.map(x => x.Id_Motivo === motivo.Id_Motivo ? motivoActualizado : x);
            this.applyFilter();
            this.snackBar.open('Motivo actualizado exitosamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al actualizar motivo:', error);
            this.snackBar.open('Error al actualizar motivo', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  loadMotivos() {
    this.loading = true;
    this.motivoService.getMotivos().subscribe({
      next: (motivos) => {
        this.motivos = motivos;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.snackBar.open('Error al cargar motivos', 'Cerrar', {duration: 3000}); this.loading = false; }
    });
  }

  applyFilter() {
    const search = this.search.trim().toLowerCase();
    if (!search) {
      this.filteredMotivos = this.motivos;
    } else {
      this.filteredMotivos = this.motivos.filter(m => m.Descripcion.toLowerCase().includes(search));
    }
  }

  eliminarMotivo(motivo: MotivoScrapDto) {
    if (confirm(`¿Está seguro de que desea eliminar el motivo "${motivo.Descripcion}"?`)) {
      // TODO: Implementar eliminación cuando esté disponible en el backend
      this.snackBar.open('Funcionalidad de eliminación no implementada aún', 'Cerrar', { duration: 3000 });
    }
  }
}
