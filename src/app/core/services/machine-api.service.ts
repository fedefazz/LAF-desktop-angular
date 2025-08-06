import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PSSMachine } from '../models/laf-business.model';
import { MaquinasDto } from '../models/laf-api.dto';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MachineService extends ApiService {
  private machinesSignal = signal<PSSMachine[]>([]);
  private machinesSubject = new BehaviorSubject<PSSMachine[]>([]);

  // Public observables
  public readonly machines$ = this.machinesSubject.asObservable();
  public readonly machines = this.machinesSignal.asReadonly();

  // Computed values
  public readonly activeMachines = computed(() => 
    this.machinesSignal().filter(machine => machine.enabled)
  );

  public readonly machineCount = computed(() => this.machinesSignal().length);
  public readonly activeMachineCount = computed(() => this.activeMachines().length);

  constructor() {
    super(inject(HttpClient));
    this.loadMachines();
  }

  public loadMachines(): void {
    this.getMachines().subscribe({
      next: (machines) => {
        this.machinesSignal.set(machines);
        this.machinesSubject.next(machines);
      },
      error: (error) => {
        console.error('Error loading machines:', error);
      }
    });
  }

  public getMachines(): Observable<PSSMachine[]> {
    return this.get<MaquinasDto[]>('PSSMaquinas').pipe(
      map(dtos => dtos.map(dto => this.mapMaquinasDtoToPSSMachine(dto))),
      catchError(error => {
        console.error('Error fetching machines:', error);
        throw error;
      })
    );
  }

  public getMachine(id: string): Observable<PSSMachine> {
    return this.get<MaquinasDto>(`PSSMaquinas/${id}`).pipe(
      map(dto => this.mapMaquinasDtoToPSSMachine(dto)),
      catchError(error => {
        console.error('Error fetching machine:', error);
        throw error;
      })
    );
  }

  public getMachinesByOperator(operatorId: string): Observable<PSSMachine[]> {
    return this.get<MaquinasDto[]>(`PSSMaquinas/GetPSSMaquinasPorOperador/?id=${operatorId}`).pipe(
      map(dtos => dtos.map(dto => this.mapMaquinasDtoToPSSMachine(dto))),
      catchError(error => {
        console.error('Error fetching machines by operator:', error);
        throw error;
      })
    );
  }

  public createMachine(machine: Omit<PSSMachine, 'id' | 'createdAt' | 'updatedAt'>): Observable<PSSMachine> {
    const maquinasDto = this.mapPSSMachineToMaquinasDto({
      ...machine,
      id: '0', // Será asignado por la API
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.post<MaquinasDto>('PSSMaquinas', maquinasDto).pipe(
      map(dto => {
        const newMachine = this.mapMaquinasDtoToPSSMachine(dto);
        
        // Actualizar el estado local
        const currentMachines = this.machinesSignal();
        const updatedMachines = [...currentMachines, newMachine];
        
        this.machinesSignal.set(updatedMachines);
        this.machinesSubject.next(updatedMachines);

        return newMachine;
      }),
      catchError(error => {
        console.error('Error creating machine:', error);
        throw error;
      })
    );
  }

  public updateMachine(machine: PSSMachine): Observable<PSSMachine> {
    const maquinasDto = this.mapPSSMachineToMaquinasDto(machine);
    
    return this.put<void>(`PSSMaquinas/${machine.id}`, maquinasDto).pipe(
      map(() => {
        const updatedMachine = { ...machine, updatedAt: new Date() };
        
        // Actualizar el estado local
        const currentMachines = this.machinesSignal();
        const updatedMachines = currentMachines.map(m => 
          m.id === machine.id ? updatedMachine : m
        );
        
        this.machinesSignal.set(updatedMachines);
        this.machinesSubject.next(updatedMachines);

        return updatedMachine;
      }),
      catchError(error => {
        console.error('Error updating machine:', error);
        throw error;
      })
    );
  }

  public deleteMachine(id: string): Observable<void> {
    return this.delete<void>(`PSSMaquinas/${id}`).pipe(
      map(() => {
        // Actualizar el estado local
        const currentMachines = this.machinesSignal();
        const updatedMachines = currentMachines.filter(m => m.id !== id);
        
        this.machinesSignal.set(updatedMachines);
        this.machinesSubject.next(updatedMachines);
      }),
      catchError(error => {
        console.error('Error deleting machine:', error);
        throw error;
      })
    );
  }

  // Helper methods para mapear entre DTOs y modelos de negocio
  private mapMaquinasDtoToPSSMachine(dto: MaquinasDto): PSSMachine {
    return {
      id: dto.IDMaq.toString(),
      description: dto.Descripcion || '',
      resource: dto.Recurso || '',
      areaId: dto.IDArea.toString(),
      area: dto.PSSAreas ? {
        id: dto.PSSAreas.IDArea.toString(),
        description: dto.PSSAreas.Descripcion || '',
        enabled: dto.PSSAreas.Habilitado,
        createdAt: new Date(),
        updatedAt: new Date()
      } : undefined,
      enabled: dto.Habilitado,
      scrapOrigins: dto.PSSOrigenesScrap?.map(origen => ({
        id: origen.IDOrigenScrap.toString(),
        description: origen.Descripcion || '',
        code: origen.Codigo || '',
        enabled: origen.Habilitado,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      materialTypes: dto.PSSTiposMaterial?.map(tipo => ({
        id: tipo.IDTipoMaterial.toString(),
        description: tipo.Descripcion || '',
        code: tipo.Codigo || '',
        enabled: tipo.Habilitado,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      activities: dto.PSSActividades?.map(actividad => ({
        id: actividad.IDActividad.toString(),
        description: actividad.Descripcion || '',
        code: actividad.Codigo || '',
        enabled: actividad.Habilitado,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private mapPSSMachineToMaquinasDto(machine: PSSMachine): MaquinasDto {
    return {
      IDMaq: parseInt(machine.id),
      Descripcion: machine.description,
      Recurso: machine.resource,
      IDArea: parseInt(machine.areaId),
      Habilitado: machine.enabled
    };
  }
}
