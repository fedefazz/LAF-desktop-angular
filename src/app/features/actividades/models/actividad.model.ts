/**
 * Modelo de datos para el módulo de Actividades
 * Representa los tipos de actividades del sistema de producción
 */

export interface ActividadDto {
  IdActividad: number;
  Descripcion: string;
  Habilitada?: boolean;
}

/**
 * DTO para crear una nueva actividad (sin ID)
 */
export interface CreateActividadDto {
  Descripcion: string;
}

/**
 * DTO para actualizar una actividad existente
 */
export interface UpdateActividadDto {
  IdActividad: number;
  Descripcion: string;
  Habilitada?: boolean;
}
