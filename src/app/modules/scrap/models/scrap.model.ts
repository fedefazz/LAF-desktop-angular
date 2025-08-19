export interface ScrapDto {
  IdRegScrap: number;
  Fecha: Date;
  NumOP: number;
  IdMaq: number;
  IdOperador: number;
  IdActividad: number;
  IdTipoMat: number;
  IdOrigenScrap: number;
  Peso: number;
  Observaciones: string;
  FechaRegistro: Date;
  IdMaqImputaScrap: number;
  Habilitado?: boolean;
  IdMaqImputaScrapName: string;

  // Related entities
  PSSActividades?: ActividadDto;
  PSSMaquinas?: MaquinasDto;
  PSSOperadores?: OperadoresDto;
  PSSOrigenesScrap?: OrigenesScrapDto;
  PSSTiposMaterial?: TiposMaterialDto;
}

export interface ActividadDto {
  IdActividad: number;
  Descripcion: string;
}

export interface MaquinasDto {
  IDMaq: number;
  Descripcion: string;
}

export interface OperadoresDto {
  IdOperador: number;
  Nombre: string;
  Apellido: string;
}

export interface OrigenesScrapDto {
  IDOrigen: number;
  Descripcion: string;
}

export interface TiposMaterialDto {
  IDTipoMat: number;
  Descripcion: string;
}

export interface ScrapServerSideResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: ScrapDto[];
}

export interface ScrapFilters {
  start: number;
  length: number;
  search: string;
  order: number;
  orderDir: 'asc' | 'desc';
  draw: number;
  dateDesde: string;
  dateHasta: string;
}
