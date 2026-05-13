import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrigenScrapDto, CreateOrigenScrapDto, UpdateOrigenScrapDto, MaquinaDto, TipoMaterialDto } from '../models/origen-scrap.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrigenScrapService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/PSSOrigenesScraps`;
  private maquinasUrl = `${environment.apiUrl}/PSSMaquinas`;
  private tiposUrl = `${environment.apiUrl}/PSSTiposMaterials`;

  getOrigenes(): Observable<OrigenScrapDto[]> {
    return this.http.get<OrigenScrapDto[]>(this.baseUrl);
  }

  getOrigenById(id: number): Observable<OrigenScrapDto> {
    return this.http.get<OrigenScrapDto>(`${this.baseUrl}?id=${id}`);
  }

  getMaquinas(): Observable<MaquinaDto[]> {
    return this.http.get<MaquinaDto[]>(this.maquinasUrl);
  }

  getTiposMaterial(): Observable<TipoMaterialDto[]> {
    return this.http.get<TipoMaterialDto[]>(this.tiposUrl);
  }

  createOrigen(data: CreateOrigenScrapDto): Observable<OrigenScrapDto> {
    return this.http.post<OrigenScrapDto>(this.baseUrl, data);
  }

  updateOrigen(id: number, data: UpdateOrigenScrapDto): Observable<any> {
    return this.http.put(`${this.baseUrl}?id=${id}`, data);
  }

  deleteOrigen(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?id=${id}`);
  }
}
