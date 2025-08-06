import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import { Operator, OperatorStatus, OperatorSkill } from '../models/laf-business.model';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  private operatorsSubject = new BehaviorSubject<Operator[]>([]);
  public operators$ = this.operatorsSubject.asObservable();

  // Signals para estado reactivo
  private operatorsSignal = signal<Operator[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  public operators = this.operatorsSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  public operatorStats = computed(() => {
    const operators = this.operatorsSignal();
    return {
      total: operators.length,
      active: operators.filter(o => o.status === OperatorStatus.ACTIVE).length,
      inactive: operators.filter(o => o.status === OperatorStatus.INACTIVE).length,
      onLeave: operators.filter(o => o.status === OperatorStatus.ON_LEAVE).length,
      terminated: operators.filter(o => o.status === OperatorStatus.TERMINATED).length,
      morningShift: operators.filter(o => o.shift === 'MORNING').length,
      afternoonShift: operators.filter(o => o.shift === 'AFTERNOON').length,
      nightShift: operators.filter(o => o.shift === 'NIGHT').length
    };
  });

  constructor() {
    this.loadOperators();
  }

  private loadOperators(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulamos datos mock
    setTimeout(() => {
      const mockOperators = this.generateMockOperators();
      this.operatorsSignal.set(mockOperators);
      this.operatorsSubject.next(mockOperators);
      this.loadingSignal.set(false);
    }, 1000);
  }

  public getAllOperators(): Observable<Operator[]> {
    return this.operators$.pipe(delay(500));
  }

  public getOperatorById(id: string): Observable<Operator | undefined> {
    return this.operators$.pipe(
      map(operators => operators.find(o => o.id === id)),
      delay(300)
    );
  }

  public getOperatorsByStatus(status: OperatorStatus): Observable<Operator[]> {
    return this.operators$.pipe(
      map(operators => operators.filter(o => o.status === status)),
      delay(300)
    );
  }

  public getOperatorsByShift(shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ROTATING'): Observable<Operator[]> {
    return this.operators$.pipe(
      map(operators => operators.filter(o => o.shift === shift)),
      delay(300)
    );
  }

  public getOperatorsByDepartment(department: string): Observable<Operator[]> {
    return this.operators$.pipe(
      map(operators => operators.filter(o => o.department === department)),
      delay(300)
    );
  }

  public createOperator(operator: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>): Observable<Operator> {
    const newOperator: Operator = {
      ...operator,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentOperators = this.operatorsSignal();
    const updatedOperators = [...currentOperators, newOperator];
    
    this.operatorsSignal.set(updatedOperators);
    this.operatorsSubject.next(updatedOperators);

    return of(newOperator).pipe(delay(500));
  }

  public updateOperator(id: string, updates: Partial<Operator>): Observable<Operator> {
    const currentOperators = this.operatorsSignal();
    const operatorIndex = currentOperators.findIndex(o => o.id === id);
    
    if (operatorIndex === -1) {
      throw new Error('Operator not found');
    }

    const updatedOperator = {
      ...currentOperators[operatorIndex],
      ...updates,
      updatedAt: new Date()
    };

    const updatedOperators = [...currentOperators];
    updatedOperators[operatorIndex] = updatedOperator;
    
    this.operatorsSignal.set(updatedOperators);
    this.operatorsSubject.next(updatedOperators);

    return of(updatedOperator).pipe(delay(500));
  }

  public deleteOperator(id: string): Observable<boolean> {
    const currentOperators = this.operatorsSignal();
    const updatedOperators = currentOperators.filter(o => o.id !== id);
    
    this.operatorsSignal.set(updatedOperators);
    this.operatorsSubject.next(updatedOperators);

    return of(true).pipe(delay(500));
  }

  public assignOperatorToMachine(operatorId: string, machineId: string): Observable<Operator> {
    return this.updateOperator(operatorId, { currentMachineId: machineId });
  }

  public unassignOperatorFromMachine(operatorId: string): Observable<Operator> {
    return this.updateOperator(operatorId, { currentMachineId: undefined });
  }

  public searchOperators(query: string): Observable<Operator[]> {
    return this.operators$.pipe(
      map(operators => operators.filter(o => 
        o.employeeNumber.toLowerCase().includes(query.toLowerCase()) ||
        o.firstName.toLowerCase().includes(query.toLowerCase()) ||
        o.lastName.toLowerCase().includes(query.toLowerCase()) ||
        o.email.toLowerCase().includes(query.toLowerCase()) ||
        o.department.toLowerCase().includes(query.toLowerCase())
      )),
      delay(300)
    );
  }

  private generateMockOperators(): Operator[] {
    const firstNames = [
      'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'Miguel', 'Rosa',
      'Antonio', 'Isabel', 'Francisco', 'Pilar', 'José', 'Dolores', 'Manuel'
    ];

    const lastNames = [
      'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez',
      'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández'
    ];

    const departments = [
      'Impresión', 'Laminación', 'Corte', 'Mangas', 'Calidad', 'Mantenimiento',
      'Almacén', 'Expedición', 'Rebobinado', 'Extrusión'
    ];

    const shifts = ['MORNING', 'AFTERNOON', 'NIGHT', 'ROTATING'] as const;
    const statuses = [OperatorStatus.ACTIVE, OperatorStatus.INACTIVE, OperatorStatus.ON_LEAVE];

    const operators: Operator[] = [];
    
    for (let i = 1; i <= 30; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      
      const hireDate = new Date();
      hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 10) - 1);
      hireDate.setMonth(Math.floor(Math.random() * 12));
      hireDate.setDate(Math.floor(Math.random() * 28) + 1);

      const skills: OperatorSkill[] = [];
      const numSkills = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numSkills; j++) {
        skills.push({
          machineTypeId: `MTYPE-${j + 1}`,
          machineTypeName: ['Impresora Flexográfica', 'Laminadora', 'Cortadora'][j] || 'Máquina General',
          level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'][Math.floor(Math.random() * 4)] as any,
          certifiedDate: new Date(hireDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000)
        });
      }

      operators.push({
        id: `OP-${i.toString().padStart(3, '0')}`,
        employeeNumber: `EMP-${i.toString().padStart(4, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@laf.com`,
        phone: `+54 11 ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        department,
        shift: shifts[Math.floor(Math.random() * shifts.length)],
        skills,
        certifications: [
          'Seguridad Industrial',
          'Manejo de Máquinas',
          'Control de Calidad'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        hireDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        salary: Math.floor(Math.random() * 200000) + 150000,
        daySalary: Math.floor(Math.random() * 8000) + 5000,
        currentMachineId: Math.random() > 0.6 ? `MAC-${Math.floor(Math.random() * 10) + 1}` : undefined,
        createdAt: hireDate,
        updatedAt: new Date()
      });
    }

    return operators;
  }

  public refreshOperators(): void {
    this.loadOperators();
  }
}
