import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OperatorService } from '../../core/services/operator-api.service';
import { Operator, OperatorStatus } from '../../core/models/laf-business.model';

@Component({
  selector: 'app-operator-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    FormsModule,
    RouterModule
  ],
  template: `
    <div class="operator-management">
      <!-- Header Section -->
      <div class="header-section">
        <div class="title-section">
          <h1>
            <mat-icon>people</mat-icon>
            Gestión de Operadores
          </h1>
          <p>Administra los operadores y su asignación a máquinas</p>
        </div>
        
        <div class="actions-section">
          <button mat-raised-button color="primary" (click)="createOperator()">
            <mat-icon>person_add</mat-icon>
            Nuevo Operador
          </button>
          <button mat-button (click)="refreshData()">
            <mat-icon>refresh</mat-icon>
            Actualizar
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <mat-card class="stat-card stat-total">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ operatorStats().total }}</div>
                <div class="stat-label">Total Operadores</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-active">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ operatorStats().active }}</div>
                <div class="stat-label">Activos</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-morning">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>wb_sunny</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ operatorStats().morningShift }}</div>
                <div class="stat-label">Turno Mañana</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-afternoon">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>wb_twilight</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ operatorStats().afternoonShift }}</div>
                <div class="stat-label">Turno Tarde</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-night">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>brightness_3</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ operatorStats().nightShift }}</div>
                <div class="stat-label">Turno Noche</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filters Section -->
      <mat-card class="filters-section">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput 
                     [(ngModel)]="searchQuery" 
                     (ngModelChange)="onSearchChange()"
                     placeholder="Buscar por nombre, legajo, email...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="selectedStatus" (ngModelChange)="onFilterChange()">
                <mat-option value="">Todos</mat-option>
                <mat-option value="{{ OperatorStatus.ACTIVE }}">Activo</mat-option>
                <mat-option value="{{ OperatorStatus.INACTIVE }}">Inactivo</mat-option>
                <mat-option value="{{ OperatorStatus.ON_LEAVE }}">De Licencia</mat-option>
                <mat-option value="{{ OperatorStatus.TERMINATED }}">Desvinculado</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Departamento</mat-label>
              <mat-select [(ngModel)]="selectedDepartment" (ngModelChange)="onFilterChange()">
                <mat-option value="">Todos</mat-option>
                <mat-option value="Impresión">Impresión</mat-option>
                <mat-option value="Laminación">Laminación</mat-option>
                <mat-option value="Corte">Corte</mat-option>
                <mat-option value="Mangas">Mangas</mat-option>
                <mat-option value="Calidad">Calidad</mat-option>
                <mat-option value="Mantenimiento">Mantenimiento</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Turno</mat-label>
              <mat-select [(ngModel)]="selectedShift" (ngModelChange)="onFilterChange()">
                <mat-option value="">Todos</mat-option>
                <mat-option value="MORNING">Mañana</mat-option>
                <mat-option value="AFTERNOON">Tarde</mat-option>
                <mat-option value="NIGHT">Noche</mat-option>
                <mat-option value="ROTATING">Rotativo</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Limpiar
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Operators Table -->
      <mat-card class="table-section">
        <mat-card-content>
          @if (loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando operadores...</p>
            </div>
          } @else {
            <div class="table-container">
              <table class="operators-table">
                
                <!-- Employee Number Column -->
                <ng-container matColumnDef="employeeNumber">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Legajo</th>
                  <td mat-cell *matCellDef="let operator">
                    <strong>{{ operator.employeeNumber }}</strong>
                  </td>
                </ng-container>

                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                  <td mat-cell *matCellDef="let operator">
                    <div class="operator-info">
                      <div class="operator-name">{{ operator.firstName }} {{ operator.lastName }}</div>
                      <div class="operator-email">{{ operator.email }}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Department Column -->
                <ng-container matColumnDef="department">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Departamento</th>
                  <td mat-cell *matCellDef="let operator">
                    {{ operator.department }}
                  </td>
                </ng-container>

                <!-- Shift Column -->
                <ng-container matColumnDef="shift">
                  <th mat-header-cell *matHeaderCellDef>Turno</th>
                  <td mat-cell *matCellDef="let operator">
                    <mat-chip [class]="'shift-' + operator.shift.toLowerCase()">
                      {{ getShiftLabel(operator.shift) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let operator">
                    <mat-chip [class]="'status-' + getStatusClass(operator.status)">
                      {{ getStatusLabel(operator.status) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Skills Column -->
                <ng-container matColumnDef="skills">
                  <th mat-header-cell *matHeaderCellDef>Habilidades</th>
                  <td mat-cell *matCellDef="let operator">
                    <div class="skills-container">
                      @for (skill of operator.skills.slice(0, 2); track skill.machineTypeId) {
                        <mat-chip class="skill-chip">
                          {{ skill.machineTypeName }}
                        </mat-chip>
                      }
                      @if (operator.skills.length > 2) {
                        <mat-chip class="more-skills">
                          +{{ operator.skills.length - 2 }} más
                        </mat-chip>
                      }
                    </div>
                  </td>
                </ng-container>

                <!-- Current Machine Column -->
                <ng-container matColumnDef="currentMachine">
                  <th mat-header-cell *matHeaderCellDef>Máquina Actual</th>
                  <td mat-cell *matCellDef="let operator">
                    @if (operator.currentMachineId) {
                      <mat-chip class="machine-assigned">
                        <mat-icon>precision_manufacturing</mat-icon>
                        {{ operator.currentMachineId }}
                      </mat-chip>
                    } @else {
                      <span class="no-assignment">Sin asignar</span>
                    }
                  </td>
                </ng-container>

                <!-- Hire Date Column -->
                <ng-container matColumnDef="hireDate">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Ingreso</th>
                  <td mat-cell *matCellDef="let operator">
                    {{ operator.hireDate | date:'dd/MM/yyyy' }}
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let operator">
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewOperator(operator)">
                        <mat-icon>visibility</mat-icon>
                        Ver Detalles
                      </button>
                      <button mat-menu-item (click)="editOperator(operator)">
                        <mat-icon>edit</mat-icon>
                        Editar
                      </button>
                      <button mat-menu-item (click)="assignMachine(operator)">
                        <mat-icon>precision_manufacturing</mat-icon>
                        Asignar Máquina
                      </button>
                      <button mat-menu-item (click)="manageSkills(operator)">
                        <mat-icon>school</mat-icon>
                        Gestionar Habilidades
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteOperator(operator)" class="delete-action">
                        <mat-icon>delete</mat-icon>
                        Eliminar
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                    class="operator-row"
                    (click)="viewOperator(row)"></tr>
              </table>

              @if (filteredOperators().length === 0) {
                <div class="no-data">
                  <mat-icon>people</mat-icon>
                  <h3>No se encontraron operadores</h3>
                  <p>Intenta ajustar los filtros o crear un nuevo operador</p>
                </div>
              }
            </div>

            <mat-paginator 
              [pageSizeOptions]="[5, 10, 25, 50]"
              [pageSize]="10"
              showFirstLastButtons>
            </mat-paginator>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './operator-management.component.scss'
})
export class OperatorManagementComponent implements OnInit {
  protected readonly OperatorStatus = OperatorStatus;
  
  // Inject service
  private operatorService = inject(OperatorService);
  
  // Signals
  operators = this.operatorService.operators;
  loading = this.operatorService.loading;
  operatorStats = this.operatorService.stats;

  // Filters
  searchQuery = signal('');
  selectedStatus = signal('');
  selectedDepartment = signal('');
  selectedShift = signal('');

  // Computed filtered operators
  filteredOperators = computed(() => {
    let operators = this.operators();
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    const department = this.selectedDepartment();
    const shift = this.selectedShift();

    if (query) {
      operators = operators.filter(o => 
        o.employeeNumber.toLowerCase().includes(query) ||
        o.firstName.toLowerCase().includes(query) ||
        o.lastName.toLowerCase().includes(query) ||
        o.email.toLowerCase().includes(query)
      );
    }

    if (status) {
      operators = operators.filter(o => o.status === status);
    }

    if (department) {
      operators = operators.filter(o => o.department === department);
    }

    if (shift) {
      operators = operators.filter(o => o.shift === shift);
    }

    return operators;
  });

  displayedColumns: string[] = [
    'employeeNumber', 'name', 'department', 'shift', 'status', 
    'skills', 'currentMachine', 'hireDate', 'actions'
  ];

  constructor() {}

  ngOnInit(): void {
    this.operatorService.refreshOperators();
  }

  onSearchChange(): void {
    // Search is handled reactively by computed signal
  }

  onFilterChange(): void {
    // Filters are handled reactively by computed signal
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedStatus.set('');
    this.selectedDepartment.set('');
    this.selectedShift.set('');
  }

  refreshData(): void {
    this.operatorService.refreshOperators();
  }

  createOperator(): void {
    // TODO: Navigate to create operator form
    console.log('Create operator');
  }

  viewOperator(operator: Operator): void {
    // TODO: Navigate to operator details
    console.log('View operator:', operator);
  }

  editOperator(operator: Operator): void {
    // TODO: Navigate to edit operator form
    console.log('Edit operator:', operator);
  }

  assignMachine(operator: Operator): void {
    // TODO: Open machine assignment dialog
    console.log('Assign machine to operator:', operator);
  }

  manageSkills(operator: Operator): void {
    // TODO: Open skills management dialog
    console.log('Manage skills for operator:', operator);
  }

  deleteOperator(operator: Operator): void {
    // TODO: Open confirmation dialog
    console.log('Delete operator:', operator);
  }

  getStatusClass(status: OperatorStatus): string {
    switch (status) {
      case OperatorStatus.ACTIVE: return 'active';
      case OperatorStatus.INACTIVE: return 'inactive';
      case OperatorStatus.ON_LEAVE: return 'on-leave';
      case OperatorStatus.TERMINATED: return 'terminated';
      default: return 'default';
    }
  }

  getStatusLabel(status: OperatorStatus): string {
    switch (status) {
      case OperatorStatus.ACTIVE: return 'Activo';
      case OperatorStatus.INACTIVE: return 'Inactivo';
      case OperatorStatus.ON_LEAVE: return 'De Licencia';
      case OperatorStatus.TERMINATED: return 'Desvinculado';
      default: return 'Desconocido';
    }
  }

  getShiftLabel(shift: string): string {
    switch (shift) {
      case 'MORNING': return 'Mañana';
      case 'AFTERNOON': return 'Tarde';
      case 'NIGHT': return 'Noche';
      case 'ROTATING': return 'Rotativo';
      default: return shift;
    }
  }
}
