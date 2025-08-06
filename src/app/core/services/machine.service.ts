import { Injectable, signal, computed } from '@angular/core';
import { Machine, MachineType, MachineStatus, MachineSpecifications } from '../models/laf-business.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  // Mock data para demostración
  private machines = signal<Machine[]>([
    {
      id: '1',
      name: 'Impresora Flexográfica #1',
      code: 'IMP-001',
      type: {
        id: '1',
        name: 'Impresora Flexográfica',
        category: 'PRODUCTION',
        description: 'Impresora flexográfica de 8 colores'
      },
      status: MachineStatus.ACTIVE,
      location: 'Planta A - Línea 1',
      department: 'Producción',
      operator: 'Juan Pérez',
      lastMaintenance: new Date('2025-01-15'),
      nextMaintenance: new Date('2025-02-15'),
      specifications: {
        model: 'Flexo-Master 8C',
        manufacturer: 'FlexTech Industries',
        year: 2022,
        capacity: '150 m/min',
        powerConsumption: '45 kW',
        dimensions: {
          width: 3200,
          height: 2100,
          length: 8500,
          unit: 'mm'
        }
      },
      createdAt: new Date('2022-03-15'),
      updatedAt: new Date('2025-01-20')
    },
    {
      id: '2',
      name: 'Cortadora Rotativa #2',
      code: 'COR-002',
      type: {
        id: '2',
        name: 'Cortadora Rotativa',
        category: 'PRODUCTION',
        description: 'Cortadora rotativa de alta precisión'
      },
      status: MachineStatus.MAINTENANCE,
      location: 'Planta A - Línea 2',
      department: 'Producción',
      operator: 'María González',
      lastMaintenance: new Date('2025-01-25'),
      nextMaintenance: new Date('2025-02-25'),
      specifications: {
        model: 'Roto-Cut Pro',
        manufacturer: 'CutTech Solutions',
        year: 2021,
        capacity: '200 cortes/min',
        powerConsumption: '30 kW',
        dimensions: {
          width: 2800,
          height: 1800,
          length: 6200,
          unit: 'mm'
        }
      },
      createdAt: new Date('2021-08-10'),
      updatedAt: new Date('2025-01-25')
    },
    {
      id: '3',
      name: 'Laminadora #1',
      code: 'LAM-001',
      type: {
        id: '3',
        name: 'Laminadora',
        category: 'PRODUCTION',
        description: 'Laminadora de alta velocidad'
      },
      status: MachineStatus.ACTIVE,
      location: 'Planta B - Línea 1',
      department: 'Producción',
      operator: 'Carlos Rodríguez',
      lastMaintenance: new Date('2025-01-10'),
      nextMaintenance: new Date('2025-02-10'),
      specifications: {
        model: 'Lam-Pro 2000',
        manufacturer: 'LamTech Corp',
        year: 2023,
        capacity: '120 m/min',
        powerConsumption: '38 kW',
        dimensions: {
          width: 2900,
          height: 2000,
          length: 7200,
          unit: 'mm'
        }
      },
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: '4',
      name: 'Extrusora #1',
      code: 'EXT-001',
      type: {
        id: '4',
        name: 'Extrusora',
        category: 'PRODUCTION',
        description: 'Extrusora de film plástico'
      },
      status: MachineStatus.ACTIVE,
      location: 'Planta C',
      department: 'Producción',
      operator: 'Ana López',
      lastMaintenance: new Date('2025-01-20'),
      nextMaintenance: new Date('2025-02-20'),
      specifications: {
        model: 'Extru-Max 500',
        manufacturer: 'PlasticTech',
        year: 2020,
        capacity: '500 kg/h',
        powerConsumption: '75 kW',
        dimensions: {
          width: 4500,
          height: 3200,
          length: 12000,
          unit: 'mm'
        }
      },
      createdAt: new Date('2020-06-15'),
      updatedAt: new Date('2025-01-22')
    }
  ]);

  private machineTypes = signal<MachineType[]>([
    {
      id: '1',
      name: 'Impresora Flexográfica',
      category: 'PRODUCTION',
      description: 'Máquinas de impresión flexográfica para envases'
    },
    {
      id: '2',
      name: 'Cortadora Rotativa',
      category: 'PRODUCTION',
      description: 'Cortadoras rotativas de alta precisión'
    },
    {
      id: '3',
      name: 'Laminadora',
      category: 'PRODUCTION',
      description: 'Laminadoras para multicapas'
    },
    {
      id: '4',
      name: 'Extrusora',
      category: 'PRODUCTION',
      description: 'Extrusoras de film plástico'
    },
    {
      id: '5',
      name: 'Selladora',
      category: 'PACKAGING',
      description: 'Selladoras para envases'
    }
  ]);

  // Computed properties
  readonly allMachines = this.machines.asReadonly();
  readonly allMachineTypes = this.machineTypes.asReadonly();
  
  readonly activeMachines = computed(() => 
    this.machines().filter(machine => machine.status === MachineStatus.ACTIVE)
  );
  
  readonly machinesInMaintenance = computed(() => 
    this.machines().filter(machine => machine.status === MachineStatus.MAINTENANCE)
  );
  
  readonly machinesByDepartment = computed(() => {
    const departments: Record<string, Machine[]> = {};
    this.machines().forEach(machine => {
      if (!departments[machine.department]) {
        departments[machine.department] = [];
      }
      departments[machine.department].push(machine);
    });
    return departments;
  });

  readonly machinesNeedingMaintenance = computed(() => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    return this.machines().filter(machine => 
      machine.nextMaintenance <= threeDaysFromNow
    );
  });

  // Methods
  getMachineById(id: string): Machine | undefined {
    return this.machines().find(machine => machine.id === id);
  }

  getMachinesByType(typeId: string): Machine[] {
    return this.machines().filter(machine => machine.type.id === typeId);
  }

  getMachinesByStatus(status: MachineStatus): Machine[] {
    return this.machines().filter(machine => machine.status === status);
  }

  addMachine(machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newMachine: Machine = {
      ...machine,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.machines.update(machines => [...machines, newMachine]);
  }

  updateMachine(id: string, updates: Partial<Machine>): void {
    this.machines.update(machines => 
      machines.map(machine => 
        machine.id === id 
          ? { ...machine, ...updates, updatedAt: new Date() }
          : machine
      )
    );
  }

  updateMachineStatus(id: string, status: MachineStatus): void {
    this.updateMachine(id, { status });
  }

  scheduleMaintenance(id: string, date: Date): void {
    this.updateMachine(id, { nextMaintenance: date });
  }

  completeMaintenance(id: string): void {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    this.updateMachine(id, {
      status: MachineStatus.ACTIVE,
      lastMaintenance: today,
      nextMaintenance: nextMonth
    });
  }

  deleteMachine(id: string): void {
    this.machines.update(machines => 
      machines.filter(machine => machine.id !== id)
    );
  }

  // Machine Types methods
  addMachineType(type: Omit<MachineType, 'id'>): void {
    const newType: MachineType = {
      ...type,
      id: this.generateId()
    };
    
    this.machineTypes.update(types => [...types, newType]);
  }

  updateMachineType(id: string, updates: Partial<MachineType>): void {
    this.machineTypes.update(types => 
      types.map(type => 
        type.id === id ? { ...type, ...updates } : type
      )
    );
  }

  deleteMachineType(id: string): void {
    this.machineTypes.update(types => 
      types.filter(type => type.id !== id)
    );
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  getMachineStatusColor(status: MachineStatus): string {
    const colors = {
      [MachineStatus.ACTIVE]: 'primary',
      [MachineStatus.MAINTENANCE]: 'warn',
      [MachineStatus.INACTIVE]: 'accent',
      [MachineStatus.ERROR]: 'warn'
    };
    return colors[status];
  }

  getMachineStatusIcon(status: MachineStatus): string {
    const icons = {
      [MachineStatus.ACTIVE]: 'check_circle',
      [MachineStatus.MAINTENANCE]: 'build',
      [MachineStatus.INACTIVE]: 'pause_circle',
      [MachineStatus.ERROR]: 'error'
    };
    return icons[status];
  }

  getMachineStatusLabel(status: MachineStatus): string {
    const labels = {
      [MachineStatus.ACTIVE]: 'Activa',
      [MachineStatus.MAINTENANCE]: 'Mantenimiento',
      [MachineStatus.INACTIVE]: 'Inactiva',
      [MachineStatus.ERROR]: 'Error'
    };
    return labels[status];
  }
}
