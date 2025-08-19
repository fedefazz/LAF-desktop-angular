import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { ScrapDto, ScrapServerSideResponse, ScrapFilters, OperadoresDto, ActividadDto, TiposMaterialDto, MaquinasDto, OrigenesScrapDto } from '../models/scrap.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScrapService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl || 'http://localhost:15731/api';

  /**
   * Obtiene la lista de scraps con paginación del lado del servidor
   */
  getScrapServerSide(filters: ScrapFilters): Observable<ScrapServerSideResponse> {
    let params = new HttpParams()
      .set('start', filters.start.toString())
      .set('length', filters.length.toString())
      .set('search', filters.search)
      .set('order', filters.order.toString())
      .set('orderDir', filters.orderDir)
      .set('draw', filters.draw.toString())
      .set('dateDesde', filters.dateDesde)
      .set('dateHasta', filters.dateHasta);

    return this.http.get<ScrapServerSideResponse>(
      `${this.baseUrl}/PSSScraps/GetPSSScrapServerSide`,
      { params }
    );
  }

  /**
   * Obtiene un scrap específico por ID
   */
  getScrapById(id: number): Observable<ScrapDto> {
    return this.http.get<ScrapDto>(`${this.baseUrl}/PSSScraps/${id}`);
  }

  /**
   * Crea un nuevo scrap
   */
  createScrap(scrap: Partial<ScrapDto>): Observable<ScrapDto> {
    return this.http.post<ScrapDto>(`${this.baseUrl}/PSSScraps`, scrap);
  }

  /**
   * Actualiza un scrap existente
   */
  updateScrap(id: number, scrap: Partial<ScrapDto>): Observable<ScrapDto> {
    return this.http.put<ScrapDto>(`${this.baseUrl}/PSSScraps/${id}`, scrap);
  }

  /**
   * Elimina un scrap
   */
  deleteScrap(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(`${this.baseUrl}/PSSScraps`, { params });
  }

  /**
   * Elimina múltiples scraps (uno por uno ya que no hay endpoint de eliminación múltiple)
   */
  deleteMultipleScrap(ids: number[]): Observable<void> {
    if (ids.length === 0) {
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    // Como no hay endpoint para eliminación múltiple, eliminamos uno por uno
    const deleteObservables = ids.map(id => this.deleteScrap(id));
    
    // Usamos forkJoin para ejecutar todas las eliminaciones en paralelo
    return new Observable<void>(observer => {
      forkJoin(deleteObservables).subscribe({
        next: () => {
          observer.next();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Exporta scraps a Excel - obtiene datos JSON para generar Excel del lado del cliente
   */
  exportToExcel(dateDesde: string, dateHasta: string): Observable<any[]> {
    let params = new HttpParams()
      .set('dateDesde', dateDesde)
      .set('dateHasta', dateHasta);

    return this.http.get<any[]>(`${this.baseUrl}/PSSScraps/scrapExcel`, {
      params
    });
  }

  /**
   * Obtiene la lista de operadores
   */
  getOperadores(): Observable<OperadoresDto[]> {
    return this.http.get<OperadoresDto[]>(`${this.baseUrl}/PSSOperadores`);
  }

  /**
   * Obtiene la lista de actividades
   */
  getActividades(): Observable<ActividadDto[]> {
    return this.http.get<ActividadDto[]>(`${this.baseUrl}/PSSActividades`);
  }

  /**
   * Obtiene la lista de tipos de material
   */
  getTiposMaterial(): Observable<TiposMaterialDto[]> {
    return this.http.get<TiposMaterialDto[]>(`${this.baseUrl}/PSSTiposMaterials`);
  }

  /**
   * Obtiene la lista de máquinas
   */
  getMaquinas(): Observable<MaquinasDto[]> {
    return this.http.get<MaquinasDto[]>(`${this.baseUrl}/PSSMaquinas`);
  }

  /**
   * Obtiene la lista de orígenes de scrap
   */
  getOrigenes(): Observable<OrigenesScrapDto[]> {
    return this.http.get<OrigenesScrapDto[]>(`${this.baseUrl}/PSSOrigenesScraps`);
  }
}
