import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MachineService } from '../../core/services/machine.service';
import { Machine, MachineStatus } from '../../core/models/laf-business.model';

@Component({
  selector: 'app-machine-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatBadgeModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule
  ],
  template: `
    <div class="machine-management-container">
      <div class="header-section">
        <h1>Gestión de Máquinas</h1>
        <p>Administración y monitoreo de equipos de producción Bolsapel</p>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <mat-card class="summary-card active">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="primary">check_circle</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ activeMachinesCount() }}</span>
                <span class="summary-label">Máquinas Activas</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card maintenance">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="warn">build</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ maintenanceMachinesCount() }}</span>
                <span class="summary-label">En Mantenimiento</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card alerts">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="warn">schedule</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ maintenanceAlertsCount() }}</span>
                <span class="summary-label">Mantenimientos Próximos</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card total">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="primary">precision_manufacturing</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ totalMachinesCount() }}</span>
                <span class="summary-label">Total Máquinas</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group class="machines-tabs">
        <!-- All Machines Tab -->
        <mat-tab label="Todas las Máquinas">
          <div class="tab-content">
            <div class="machines-grid">
              <mat-card *ngFor="let machine of machineService.allMachines(); trackBy: trackByMachineId" 
                        class="machine-card">
                <mat-card-header>
                  <div mat-card-avatar class="machine-avatar" [class]="'status-' + machine.status">
                    <mat-icon>{{ getMachineTypeIcon(machine.type.category) }}</mat-icon>
                  </div>
                  <mat-card-title>{{ machine.name }}</mat-card-title>
                  <mat-card-subtitle>{{ machine.code }} - {{ machine.location }}</mat-card-subtitle>
                </mat-card-header>

                <mat-card-content>
                  <div class="machine-info">
                    <div class="status-section">
                      <mat-chip [color]="machineService.getMachineStatusColor(machine.status)">
                        <mat-icon matChipAvatar>{{ machineService.getMachineStatusIcon(machine.status) }}</mat-icon>
                        {{ machineService.getMachineStatusLabel(machine.status) }}
                      </mat-chip>
                    </div>

                    <mat-divider></mat-divider>

                    <div class="details-section">
                      <div class="detail-item">
                        <mat-icon>person</mat-icon>
                        <span>{{ machine.operator || 'Sin asignar' }}</span>
                      </div>
                      
                      <div class="detail-item">
                        <mat-icon>business</mat-icon>
                        <span>{{ machine.department }}</span>
                      </div>
                      
                      <div class="detail-item">
                        <mat-icon>speed</mat-icon>
                        <span>{{ machine.specifications.capacity }}</span>
                      </div>
                      
                      <div class="detail-item">
                        <mat-icon>flash_on</mat-icon>
                        <span>{{ machine.specifications.powerConsumption }}</span>
                      </div>
                    </div>

                    <mat-divider></mat-divider>

                    <div class="maintenance-section">
                      <div class="maintenance-info">
                        <span class="maintenance-label">Próximo Mantenimiento:</span>
                        <span class="maintenance-date" 
                              [class.overdue]="isMaintenanceOverdue(machine.nextMaintenance)">
                          {{ formatDate(machine.nextMaintenance) }}
                        </span>
                      </div>
                      
                      <mat-progress-bar 
                        mode="determinate" 
                        [value]="getMaintenanceProgress(machine)"
                        [color]="getMaintenanceProgressColor(machine)">
                      </mat-progress-bar>
                    </div>
                  </div>
                </mat-card-content>

                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>visibility</mat-icon>
                    Ver Detalles
                  </button>
                  <button mat-button *ngIf="machine.status === 'maintenance'" color="accent">
                    <mat-icon>check</mat-icon>
                    Completar Mantenimiento
                  </button>
                  <button mat-button *ngIf="machine.status === 'active'" color="warn">
                    <mat-icon>build</mat-icon>
                    Programar Mantenimiento
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- By Department Tab -->
        <mat-tab label="Por Departamento">
          <div class="tab-content">
            <div *ngFor="let dept of departmentList(); trackBy: trackByDepartment" class="department-section">
              <h3>{{ dept.name }} ({{ dept.machines.length }})</h3>
              
              <div class="machines-grid">
                <mat-card *ngFor="let machine of dept.machines; trackBy: trackByMachineId" 
                          class="machine-card compact">
                  <mat-card-header>
                    <div mat-card-avatar class="machine-avatar" [class]="'status-' + machine.status">
                      <mat-icon>{{ getMachineTypeIcon(machine.type.category) }}</mat-icon>
                    </div>
                    <mat-card-title>{{ machine.name }}</mat-card-title>
                    <mat-card-subtitle>{{ machine.code }}</mat-card-subtitle>
                  </mat-card-header>

                  <mat-card-content>
                    <mat-chip [color]="machineService.getMachineStatusColor(machine.status)">
                      {{ machineService.getMachineStatusLabel(machine.status) }}
                    </mat-chip>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Maintenance Alerts Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <span matBadge="{{ maintenanceAlertsCount() }}" matBadgeColor="warn">
              Alertas de Mantenimiento
            </span>
          </ng-template>
          
          <div class="tab-content">
            <mat-card class="alerts-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon color="warn">warning</mat-icon>
                  Máquinas que Requieren Atención
                </mat-card-title>
              </mat-card-header>
              
              <mat-card-content>
                <mat-list>
                  <mat-list-item *ngFor="let machine of machinesNeedingMaintenance(); trackBy: trackByMachineId">
                    <mat-icon matListItemIcon [color]="getMaintenanceUrgencyColor(machine)">
                      {{ getMaintenanceUrgencyIcon(machine) }}
                    </mat-icon>
                    
                    <div matListItemTitle>{{ machine.name }}</div>
                    <div matListItemLine>
                      {{ machine.location }} - Vence: {{ formatDate(machine.nextMaintenance) }}
                    </div>
                    
                    <button mat-icon-button matListItemMeta>
                      <mat-icon>chevron_right</mat-icon>
                    </button>
                  </mat-list-item>
                </mat-list>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .machine-management-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .header-section h1 {
      font-size: 2.5rem;
      font-weight: 300;
      color: var(--mat-sys-primary);
      margin-bottom: 8px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .summary-card {
      border-radius: 12px;
      transition: transform 0.2s ease;
    }

    .summary-card:hover {
      transform: translateY(-2px);
    }

    .summary-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .summary-content mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .summary-info {
      display: flex;
      flex-direction: column;
    }

    .summary-value {
      font-size: 2rem;
      font-weight: 300;
      line-height: 1;
    }

    .summary-label {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .machines-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .machines-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .machine-card {
      border-radius: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .machine-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .machine-card.compact {
      min-height: auto;
    }

    .machine-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }

    .machine-avatar.status-active {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-primary);
    }

    .machine-avatar.status-maintenance {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-error);
    }

    .machine-avatar.status-inactive {
      background: var(--mat-sys-surface-variant);
      color: var(--mat-sys-on-surface-variant);
    }

    .machine-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-section {
      display: flex;
      justify-content: center;
    }

    .details-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .detail-item mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .maintenance-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .maintenance-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .maintenance-label {
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .maintenance-date {
      font-size: 0.85rem;
      font-weight: 500;
    }

    .maintenance-date.overdue {
      color: var(--mat-sys-error);
    }

    .department-section {
      margin-bottom: 32px;
    }

    .department-section h3 {
      color: var(--mat-sys-primary);
      margin-bottom: 16px;
      font-weight: 500;
    }

    .alerts-card {
      border-left: 4px solid var(--mat-sys-error);
    }

    @media (max-width: 768px) {
      .machines-grid {
        grid-template-columns: 1fr;
      }
      
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MachineManagementComponent {
  machineService = inject(MachineService);

  // Computed properties for summary
  activeMachinesCount = computed(() => this.machineService.activeMachines().length);
  maintenanceMachinesCount = computed(() => this.machineService.machinesInMaintenance().length);
  maintenanceAlertsCount = computed(() => this.machineService.machinesNeedingMaintenance().length);
  totalMachinesCount = computed(() => this.machineService.allMachines().length);

  machinesNeedingMaintenance = this.machineService.machinesNeedingMaintenance;

  departmentList = computed(() => {
    const departments = this.machineService.machinesByDepartment();
    return Object.entries(departments).map(([name, machines]) => ({
      name,
      machines
    }));
  });

  // Track by functions
  trackByMachineId(index: number, machine: Machine): string {
    return machine.id;
  }

  trackByDepartment(index: number, dept: { name: string; machines: Machine[] }): string {
    return dept.name;
  }

  // Utility methods
  getMachineTypeIcon(category: string): string {
    const icons = {
      PRODUCTION: 'precision_manufacturing',
      PACKAGING: 'inventory',
      QUALITY: 'verified',
      MAINTENANCE: 'build'
    };
    return icons[category as keyof typeof icons] || 'settings';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isMaintenanceOverdue(date: Date): boolean {
    return date < new Date();
  }

  getMaintenanceProgress(machine: Machine): number {
    const now = new Date().getTime();
    const last = machine.lastMaintenance.getTime();
    const next = machine.nextMaintenance.getTime();
    const total = next - last;
    const elapsed = now - last;
    
    return Math.min((elapsed / total) * 100, 100);
  }

  getMaintenanceProgressColor(machine: Machine): string {
    const progress = this.getMaintenanceProgress(machine);
    if (progress > 90) return 'warn';
    if (progress > 75) return 'accent';
    return 'primary';
  }

  getMaintenanceUrgencyColor(machine: Machine): string {
    const daysUntilMaintenance = Math.ceil(
      (machine.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilMaintenance < 0) return 'warn';
    if (daysUntilMaintenance <= 1) return 'warn';
    if (daysUntilMaintenance <= 3) return 'accent';
    return 'primary';
  }

  getMaintenanceUrgencyIcon(machine: Machine): string {
    const daysUntilMaintenance = Math.ceil(
      (machine.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilMaintenance < 0) return 'error';
    if (daysUntilMaintenance <= 1) return 'warning';
    return 'schedule';
  }
}
