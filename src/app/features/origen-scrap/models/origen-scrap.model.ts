export interface OrigenScrapDto {
  IDOrigen: number;
  Descripcion: string;
  idmaquina?: number;
  Maquina?: MaquinaDto;
  PSSTiposMaterial?: TipoMaterialDto[];
}

export interface MaquinaDto {
  IDMaq: number;
  Descripcion: string;
}

export interface TipoMaterialDto {
  IDTipoMat: number;
  Descripcion: string;
}

export interface CreateOrigenScrapDto {
  Descripcion: string;
  idmaquina?: number;
  PSSTiposMaterial?: { IDTipoMat: number }[];
}

export interface UpdateOrigenScrapDto {
  IDOrigen: number;
  Descripcion: string;
  idmaquina?: number;
  PSSTiposMaterial?: { IDTipoMat: number }[];
}
