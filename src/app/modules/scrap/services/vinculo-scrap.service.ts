import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VinculoDto {
  Id_MaquinaImpute?: number;
  Id_Motivo?: number;
  Id_Origen?: number;
  Id_Recurso?: number;
  Id_TipoMaterial?: number;
  maquinas?: any[];
  tiposMaterial?: any[];
  origenes?: any[];
  recursos?: any[];
  _tempId?: number; // ID temporal para nuevos vínculos
}

@Injectable({ providedIn: 'root' })
export class VinculoScrapService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:15731/api/PSSScraps';

  /**
   * Obtiene vínculos de un motivo + catálogos para los selectores
   * Si idMotivo = 0 trae solo catálogos, si no, vínculos del motivo + catálogos
   */
  getVinculosWithCatalogos(idMotivo: number = 0): Observable<VinculoDto[]> {
    return this.http.get<VinculoDto[]>(`${this.baseUrl}/getVinculoById?id=${idMotivo}`);
  }

  /**
   * Crea un nuevo vínculo
   */
  createVinculo(vinculo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createVinculo`, vinculo);
  }

  /**
   * Actualiza un vínculo existente
   */
  updateVinculo(vinculo: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateVinculo`, vinculo);
  }

  /**
   * Elimina un vínculo
   */
  deleteVinculo(vinculoId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteVinculo?id=${vinculoId}`);
  }
}
