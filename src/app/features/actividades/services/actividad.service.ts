import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ActividadDto, CreateActividadDto, UpdateActividadDto } from '../models/actividad.model';
import { environment } from '../../../../environments/environment';

/**
 * Servicio para gestionar las actividades del sistema
 * Maneja las operaciones CRUD contra la API de PSSActividades
 */
@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/PSSActividades`;
  
  // Estado reactivo para la lista de actividades
  private actividadesSubject = new BehaviorSubject<ActividadDto[]>([]);
  public actividades$ = this.actividadesSubject.asObservable();

  /**
   * Obtiene todas las actividades desde la API
   */
  getActividades(): Observable<ActividadDto[]> {
    return this.http.get<ActividadDto[]>(this.baseUrl).pipe(
      tap(actividades => this.actividadesSubject.next(actividades))
    );
  }

  /**
   * Obtiene una actividad específica por ID
   * @param id - ID de la actividad
   */
  getActividadById(id: number): Observable<ActividadDto> {
    return this.http.get<ActividadDto>(`${this.baseUrl}?id=${id}`);
  }

  /**
   * Crea una nueva actividad
   * @param actividad - Datos de la actividad a crear
   */
  createActividad(actividad: CreateActividadDto): Observable<ActividadDto> {
    return this.http.post<ActividadDto>(this.baseUrl, actividad).pipe(
      tap(() => {
        // Refrescar la lista después de crear
        this.getActividades().subscribe();
      })
    );
  }

  /**
   * Actualiza una actividad existente
   * @param id - ID de la actividad
   * @param actividad - Datos actualizados
   */
  updateActividad(id: number, actividad: UpdateActividadDto): Observable<any> {
    return this.http.put(`${this.baseUrl}?id=${id}`, actividad).pipe(
      tap(() => {
        // Refrescar la lista después de actualizar
        this.getActividades().subscribe();
      })
    );
  }

  /**
   * Elimina una actividad
   * @param id - ID de la actividad a eliminar
   */
  deleteActividad(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?id=${id}`).pipe(
      tap(() => {
        // Refrescar la lista después de eliminar
        this.getActividades().subscribe();
      })
    );
  }

  /**
   * Refresca la lista de actividades
   */
  refresh(): void {
    this.getActividades().subscribe();
  }
}
