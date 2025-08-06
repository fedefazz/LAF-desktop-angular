import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PSSMachine } from '../../core/models/laf-business.model';
import { MachineService } from '../../core/services/machine-api.service';

@Component({
  selector: 'app-machine-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>precision_manufacturing</mat-icon>
            Gestión de Máquinas
          </mat-card-title>
          <mat-card-subtitle>
            Administración de máquinas del sistema PSS
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Stats Cards -->
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-number">{{ machineService.machineCount() }}</div>
              <div class="stat-label">Total Máquinas</div>
            </div>
            <div class="stat-card active">
              <div class="stat-number">{{ machineService.activeMachineCount() }}</div>
              <div class="stat-label">Máquinas Activas</div>
            </div>
            <div class="stat-card inactive">
              <div class="stat-number">{{ machineService.machineCount() - machineService.activeMachineCount() }}</div>
              <div class="stat-label">Máquinas Inactivas</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions-container">
            <button mat-raised-button color="primary" (click)="openMachineDialog()">
              <mat-icon>add</mat-icon>
              Nueva Máquina
            </button>
            <button mat-raised-button (click)="refreshMachines()">
              <mat-icon>refresh</mat-icon>
              Actualizar
            </button>
          </div>

          <!-- Machines Table -->
          <div class="table-container">
            <table mat-table [dataSource]="machines()" class="machines-table">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let machine">{{ machine.id }}</td>
              </ng-container>

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let machine">
                  <div class="machine-info">
                    <strong>{{ machine.description }}</strong>
                    <small>{{ machine.resource }}</small>
                  </div>
                </td>
              </ng-container>

              <!-- Area Column -->
              <ng-container matColumnDef="area">
                <th mat-header-cell *matHeaderCellDef>Área</th>
                <td mat-cell *matCellDef="let machine">
                  {{ machine.area?.description || 'Sin área' }}
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let machine">
                  <mat-chip [class.enabled]="machine.enabled" [class.disabled]="!machine.enabled">
                    {{ machine.enabled ? 'Activa' : 'Inactiva' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Operators Column -->
              <ng-container matColumnDef="operators">
                <th mat-header-cell *matHeaderCellDef>Operadores</th>
                <td mat-cell *matCellDef="let machine">
                  <div class="operators-chips">
                    <mat-chip *ngFor="let operator of machine.operators?.slice(0, 2)" 
                             matTooltip="{{ operator.firstName }} {{ operator.lastName }}">
                      {{ operator.firstName }} {{ operator.lastName }}
                    </mat-chip>
                    <mat-chip *ngIf="(machine.operators?.length || 0) > 2"
                             matTooltip="Ver todos los operadores">
                      +{{ (machine.operators?.length || 0) - 2 }} más
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Updated Column -->
              <ng-container matColumnDef="updated">
                <th mat-header-cell *matHeaderCellDef>Actualizado</th>
                <td mat-cell *matCellDef="let machine">
                  {{ machine.updatedAt | date:'short' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let machine">
                  <div class="action-buttons">
                    <button mat-icon-button (click)="editMachine(machine)" matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button 
                            (click)="toggleMachineStatus(machine)" 
                            [matTooltip]="machine.enabled ? 'Desactivar' : 'Activar'">
                      <mat-icon>{{ machine.enabled ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <button mat-icon-button 
                            (click)="deleteMachine(machine)" 
                            matTooltip="Eliminar"
                            color="warn">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #2196F3;
    }

    .stat-card.active {
      border-left-color: #4CAF50;
    }

    .stat-card.inactive {
      border-left-color: #FF9800;
    }

    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      color: #666;
      margin-top: 8px;
    }

    .actions-container {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .table-container {
      overflow-x: auto;
    }

    .machines-table {
      width: 100%;
    }

    .machine-info strong {
      display: block;
    }

    .machine-info small {
      color: #666;
      font-size: 0.8em;
    }

    .operators-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .operators-chips mat-chip {
      font-size: 0.8em;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    mat-chip.enabled {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    mat-chip.disabled {
      background-color: #fff3e0;
      color: #f57c00;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class MachineManagementComponent implements OnInit {
  protected readonly machineService = inject(MachineService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  public readonly machines = computed(() => this.machineService.machines());
  
  public readonly displayedColumns = [
    'id', 'description', 'area', 'status', 'operators', 'updated', 'actions'
  ];

  ngOnInit(): void {
    this.machineService.loadMachines();
  }

  public refreshMachines(): void {
    this.machineService.loadMachines();
    this.snackBar.open('Máquinas actualizadas', 'Cerrar', { duration: 2000 });
  }

  public openMachineDialog(machine?: PSSMachine): void {
    // TODO: Implementar dialog para crear/editar máquina
    this.snackBar.open('Funcionalidad de edición pendiente de implementar', 'Cerrar', { duration: 3000 });
  }

  public editMachine(machine: PSSMachine): void {
    this.openMachineDialog(machine);
  }

  public toggleMachineStatus(machine: PSSMachine): void {
    const updatedMachine = { ...machine, enabled: !machine.enabled };
    
    this.machineService.updateMachine(updatedMachine).subscribe({
      next: () => {
        const status = updatedMachine.enabled ? 'activada' : 'desactivada';
        this.snackBar.open(`Máquina ${status} correctamente`, 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error updating machine status:', error);
        this.snackBar.open('Error al cambiar el estado de la máquina', 'Cerrar', { duration: 3000 });
      }
    });
  }

  public deleteMachine(machine: PSSMachine): void {
    if (confirm(`¿Está seguro de que desea eliminar la máquina "${machine.description}"?`)) {
      this.machineService.deleteMachine(machine.id).subscribe({
        next: () => {
          this.snackBar.open('Máquina eliminada correctamente', 'Cerrar', { duration: 2000 });
        },
        error: (error) => {
          console.error('Error deleting machine:', error);
          this.snackBar.open('Error al eliminar la máquina', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
