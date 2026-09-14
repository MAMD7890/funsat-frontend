export interface CategoriaCatalogoResponse {
  id: number;
  nombre: string;
  requiereNumeroSerie: boolean;
  orden: number;
  activo: boolean;
}

export interface CategoriaCatalogoRequest {
  nombre: string;
  requiereNumeroSerie: boolean;
  orden: number;
  activo?: boolean | null;
}

export interface TipoMotorCatalogoResponse {
  id: number;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface TipoMotorCatalogoRequest {
  nombre: string;
  orden: number;
  activo?: boolean | null;
}
