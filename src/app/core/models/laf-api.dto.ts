// DTOs que coinciden con las APIs del backend LAF

export interface OperadorDto {
  IdOperador: number;
  Nombre: string;
  Apellido: string;
  Habilitado: boolean;
  Legajo: string;
}

export interface ProductoDto {
  Cod_Producto: string;
  Descripcion: string;
  Unid_Medida: string;
  Fecha_Creacion: Date;
  Tipo_Adm: string;
  Reemplazo_Prod: string;
  Cilindros: string;
  Referencia_Item: string;
  Liberacion?: number;
  Fecha_Liberacion: Date;
  Nro_Pedido_Original: string;
  Fecha_Pedido_Original: Date;
  CodCliente: string;
  Nombre_Cliente: string;
  OC_Cliente: string;
  Cod_Producto_Cliente: string;
  Fecha_Deseada_Cliente: Date;
  ResponsableComercial: number;
  ResponsableCustomer: number;
  Categoria: number;
  ResponsableConfeccionIng: number;
  FechaConfeccionIng: Date;
  IdentificadorCierreIng: string;
  HabilitaCierreLet: boolean;
  ResponsableLiberacionLet: number;
  FechaLiberacionLet: Date;
  ResponsableLiberacionFinalIng: number;
  FechaLiberacionFinalIng: Date;
  ObservacionesIng: string;
  CerradoIng: boolean;
  RushOrder: boolean;
  ReChequeoProducto: boolean;
  TipoImpresora: number;
  Impresora: number;
  Proveedor: number;
  ResponsablePrePrensa: number;
  EstadoPrePrensa: number;
  ObservacionesPrePrensa: string;
  FechaRecepcionArte: Date;
  FechaEnvioArte_ET: Date;
  FechaPDFModulo: Date;
  FechaAprobacionPDFCliente: Date;
  FechaEnvioCromalin: Date;
  FechaAprobacionCromalin: Date;
  FechaPDFArmado: Date;
  FechaLiberadoAGrabado: Date;
  FechaSacaPrueba: Date;
  FechaAprobacionSacaPrueba: Date;
  TipoMaterialPerfil?: number;
  PerfilImpresion: number;
  Colores: string;
  ComentariosColores: string;
  CerradoPrePrensa: boolean;
  FechaDocumento: Date;
  Estado: number;
  FechaStandBy: Date;
  ObsProducto: string;
  FechaFinStandBy: Date;
  LastRefreshDate: Date;
  ObsPerfiles: string;
  ArteModificado: boolean;
  FechaArteOriginal: Date;
  OT: string;
  TipoCilindros: number;
  FechaEntregaNuevosCilindros: Date;
  CodigosCilindros: string;
  FechaRecepcionCodigosCilindros: Date;
  FechaPreparacionCilindros: Date;
  FechaLiberacionMontaje: Date;
  FechaRetiroCilindro: Date;
  FechaPromesaProveedorGrabado: Date;
  FechaRecepcionHerramental: Date;
  ObsHerramental: string;
  NoUsaPrePrensa: boolean;
}

// DTO para listar productos (resultado del stored procedure)
export interface ProductoListDto {
  Cod_Producto: string;
  Descripcion: string;
  Fecha_Creacion: Date;
  Fecha_Deseada_Cliente: Date;
  Nombre_Cliente: string;
  Estado: number;
  Tipo_Adm: string;
  ResponsableComercial: number;
  RushOrder: boolean;
  LastRefreshDate: Date;
  FechaStandBy?: Date;
  FechaFinStandBy?: Date;
  ObsProducto?: string;
}

// PSS DTOs (Production Support System)
export interface MaquinasDto {
  IDMaq: number;
  Descripcion: string;
  Recurso: string;
  IDArea: number;
  Habilitado: boolean;
  PSSAreas?: AreasDto;
  PSSOrigenesScrap?: OrigenesScrapDto[];
  PSSOperadores?: OperadorDto[];
  PSSTiposMaterial?: TiposMaterialDto[];
  PSSActividades?: ActividadDto[];
  PSSJobTrack?: JobTrackDto[];
}

export interface AreasDto {
  IDArea: number;
  Descripcion: string;
  Habilitado: boolean;
}

export interface OrigenesScrapDto {
  IDOrigenScrap: number;
  Descripcion: string;
  Codigo: string;
  Habilitado: boolean;
}

export interface TiposMaterialDto {
  IDTipoMaterial: number;
  Descripcion: string;
  Codigo: string;
  Habilitado: boolean;
}

export interface ActividadDto {
  IDActividad: number;
  Descripcion: string;
  Codigo: string;
  Habilitado: boolean;
}

export interface JobTrackDto {
  IDJobTrack: number;
  Descripcion: string;
  FechaInicio: string;
  FechaFin?: string;
  Estado: string;
  IDMaquina: number;
  IDOperador: number;
  IDProducto: number;
}
