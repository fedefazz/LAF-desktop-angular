import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Operator, OperatorStatus, OperatorSkill } from '../models/laf-business.model';
import { OperadorDto } from '../models/laf-api.dto';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OperatorService extends ApiService {
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

  public stats = computed(() => {
    const operators = this.operatorsSignal();
    return {
      total: operators.length,
      active: operators.filter(o => o.status === OperatorStatus.ACTIVE).length,
      inactive: operators.filter(o => o.status === OperatorStatus.INACTIVE).length,
      onLeave: operators.filter(o => o.status === OperatorStatus.ON_LEAVE).length,
      morningShift: operators.filter(o => o.shift === 'MORNING').length,
      afternoonShift: operators.filter(o => o.shift === 'AFTERNOON').length,
      nightShift: operators.filter(o => o.shift === 'NIGHT').length
    };
  });

  constructor() {
    super(inject(HttpClient));
    this.loadOperators();
  }

  private loadOperators(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.getAllOperatorsFromApi().subscribe({
      next: (operators) => {
        this.operatorsSignal.set(operators);
        this.operatorsSubject.next(operators);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        console.error('Error loading operators:', error);
        this.errorSignal.set('Error al cargar operadores');
        this.loadingSignal.set(false);
      }
    });
  }

  private getAllOperatorsFromApi(): Observable<Operator[]> {
    return this.get<OperadorDto[]>('PSSOperadores').pipe(
      map(dtos => dtos.map(dto => this.mapOperadorDtoToOperator(dto))),
      catchError(error => {
        console.error('API Error:', error);
        return of([]); // Devolver array vacío en caso de error
      })
    );
  }

  private mapOperadorDtoToOperator(dto: OperadorDto): Operator {
    return {
      id: dto.IdOperador.toString(),
      employeeNumber: dto.Legajo || dto.IdOperador.toString(),
      firstName: dto.Nombre || 'Sin nombre',
      lastName: dto.Apellido || 'Sin apellido',
      email: `${dto.Nombre?.toLowerCase()}.${dto.Apellido?.toLowerCase()}@laf.com`,
      department: 'Producción', // Default department
      shift: this.getRandomShift(),
      skills: this.getDefaultSkills(),
      certifications: ['Seguridad Industrial'],
      hireDate: new Date(), // Default hire date
      status: dto.Habilitado ? OperatorStatus.ACTIVE : OperatorStatus.INACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private getRandomShift(): 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ROTATING' {
    const shifts: Array<'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ROTATING'> = ['MORNING', 'AFTERNOON', 'NIGHT', 'ROTATING'];
    return shifts[Math.floor(Math.random() * shifts.length)];
  }

  private getDefaultSkills(): OperatorSkill[] {
    return [
      {
        machineTypeId: '1',
        machineTypeName: 'Impresora',
        level: 'INTERMEDIATE',
        certifiedDate: new Date()
      }
    ];
  }

  public getAllOperators(): Observable<Operator[]> {
    return this.operators$;
  }

  public getOperatorById(id: string): Observable<Operator | undefined> {
    return this.get<OperadorDto>(`PSSOperadores/${id}`).pipe(
      map(dto => this.mapOperadorDtoToOperator(dto)),
      catchError(error => {
        console.error('Error getting operator by ID:', error);
        return of(undefined);
      })
    );
  }

  public getOperatorsByStatus(status: OperatorStatus): Observable<Operator[]> {
    return this.operators$.pipe(
      map(operators => operators.filter(o => o.status === status))
    );
  }

  public getOperatorsByShift(shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ROTATING'): Observable<Operator[]> {
    return this.operators$.pipe(
      map(operators => operators.filter(o => o.shift === shift))
    );
  }

  public getOperatorsByDepartment(department: string): Observable<Operator[]> {
    return this.operators$.pipe(
      map(operators => operators.filter(o => 
        o.department.toLowerCase().includes(department.toLowerCase())
      ))
    );
  }

  public createOperator(operator: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>): Observable<Operator> {
    const operadorDto = this.mapOperatorToOperadorDto({
      ...operator,
      id: '0', // Será asignado por la API
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.post<OperadorDto>('PSSOperadores', operadorDto).pipe(
      map(dto => {
        const newOperator = this.mapOperadorDtoToOperator(dto);
        
        // Actualizar el estado local
        const currentOperators = this.operatorsSignal();
        const updatedOperators = [...currentOperators, newOperator];
        
        this.operatorsSignal.set(updatedOperators);
        this.operatorsSubject.next(updatedOperators);

        return newOperator;
      }),
      catchError(error => {
        console.error('Error creating operator:', error);
        throw error;
      })
    );
  }

  public updateOperator(id: string, updates: Partial<Operator>): Observable<Operator> {
    // Mapear el Operator a OperadorDto para enviar a la API
    const currentOperators = this.operatorsSignal();
    const existingOperator = currentOperators.find(o => o.id === id);
    
    if (!existingOperator) {
      throw new Error('Operator not found');
    }

    const updatedOperator = { ...existingOperator, ...updates, updatedAt: new Date() };
    const operadorDto = this.mapOperatorToOperadorDto(updatedOperator);

    return this.put<void>(`PSSOperadores?id=${id}`, operadorDto).pipe(
      map(() => {
        // Actualizar el estado local después de la actualización exitosa
        const currentOperators = this.operatorsSignal();
        const index = currentOperators.findIndex(o => o.id === id);
        
        if (index !== -1) {
          const updatedOperators = [...currentOperators];
          updatedOperators[index] = updatedOperator;
          
          this.operatorsSignal.set(updatedOperators);
          this.operatorsSubject.next(updatedOperators);
        }
        
        return updatedOperator;
      }),
      catchError(error => {
        console.error('Error updating operator:', error);
        throw error;
      })
    );
  }

  private mapOperatorToOperadorDto(operator: Operator): any {
    return {
      IdOperador: parseInt(operator.id),
      Nombre: operator.firstName,
      Apellido: operator.lastName,
      Legajo: operator.employeeNumber,
      Habilitado: operator.status === OperatorStatus.ACTIVE
    };
  }

  public deleteOperator(id: string): Observable<boolean> {
    return this.delete<void>(`PSSOperadores?id=${id}`).pipe(
      map(() => {
        // Actualizar el estado local después de la eliminación exitosa
        const currentOperators = this.operatorsSignal();
        const filteredOperators = currentOperators.filter(o => o.id !== id);
        
        this.operatorsSignal.set(filteredOperators);
        this.operatorsSubject.next(filteredOperators);
        
        return true;
      }),
      catchError(error => {
        console.error('Error deleting operator:', error);
        throw error;
      })
    );
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
      ))
    );
  }

  public refreshOperators(): void {
    this.loadOperators();
  }
}
