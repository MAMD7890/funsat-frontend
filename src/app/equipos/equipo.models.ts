import { ClienteResponse } from '../clientes/cliente.models';
import { CategoriaCatalogoResponse, TipoMotorCatalogoResponse } from '../catalogos/catalogo.models';

export type EstadoEquipo = 'ACTIVO' | 'INACTIVO' | 'EN_MANTENIMIENTO' | 'DADO_DE_BAJA';
export type Propiedad = 'PROPIO' | 'EXTERNO';
export type EstadoServicioTaller =
  | 'PENDIENTE_POR_DIAGNOSTICO'
  | 'POR_INICIAR_SERVICIO'
  | 'POR_APROBAR'
  | 'POR_DEFINIR'
  | 'STAND_BY'
  | 'SIN_CANCELAR_Y_REPARADO'
  | 'PENDIENTE_REMISION'
  | 'PENDIENTE_POR_FACTURA_Y_ENTREGA'
  | 'REPARADA_POR_RETIRAR';

export const ESTADO_EQUIPO_LABEL: Record<EstadoEquipo, string> = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  EN_MANTENIMIENTO: 'En mantenimiento',
  DADO_DE_BAJA: 'Dado de baja'
};

export const PROPIEDAD_LABEL: Record<Propiedad, string> = {
  PROPIO: 'Propio',
  EXTERNO: 'Externo'
};

export const ESTADO_SERVICIO_TALLER_LABEL: Record<EstadoServicioTaller, string> = {
  PENDIENTE_POR_DIAGNOSTICO: 'Pendiente por diagnóstico',
  POR_INICIAR_SERVICIO: 'Por iniciar servicio',
  POR_APROBAR: 'Por aprobar',
  POR_DEFINIR: 'Por definir',
  STAND_BY: 'Stand by',
  SIN_CANCELAR_Y_REPARADO: 'Sin cancelar y reparado',
  PENDIENTE_REMISION: 'Pendiente remisión',
  PENDIENTE_POR_FACTURA_Y_ENTREGA: 'Pendiente por factura y entrega',
  REPARADA_POR_RETIRAR: 'Reparada - por retirar'
};

export interface EquipoAccesorioRequest {
  id?: number | null;
  nombre: string;
  cantidad: number;
}

export interface EquipoAccesorioResponse {
  id: number;
  nombre: string;
  cantidad: number;
  ubicacionActual: string | null;
  enCalle: boolean;
}

export interface EquipoRequest {
  codigo?: string | null;
  codigoTaller?: string | null;
  descripcionEquipo: string;
  categoriaId: number;
  marca?: string | null;
  numeroSerie?: string | null;
  modelo?: string | null;
  motorId?: number | null;
  ubicacion?: string | null;
  estado?: EstadoEquipo | null;
  checkMtto: boolean;
  checkHv: boolean;
  checkFt: boolean;
  propiedad: Propiedad;
  clienteId?: number | null;
  accesorios?: string | null;
  fechaIngreso?: string | null;
  fechaDiagnostico?: string | null;
  rotulado: boolean;
  estadoServicioTaller?: EstadoServicioTaller | null;
  accesoriosRegistrados: EquipoAccesorioRequest[];
}

export interface EquipoResponse {
  id: number;
  codigo: string | null;
  codigoTaller: string | null;
  descripcionEquipo: string;
  categoria: CategoriaCatalogoResponse;
  marca: string | null;
  numeroSerie: string | null;
  modelo: string | null;
  motor: TipoMotorCatalogoResponse | null;
  ubicacion: string | null;
  fechaRegistro: string;
  estado: EstadoEquipo;
  checkMtto: boolean;
  checkHv: boolean;
  checkFt: boolean;
  propiedad: Propiedad;
  cliente: ClienteResponse | null;
  accesorios: string | null;
  fechaIngreso: string | null;
  fechaDiagnostico: string | null;
  rotulado: boolean;
  estadoServicioTaller: EstadoServicioTaller | null;
  accesoriosRegistrados: EquipoAccesorioResponse[];
  enCalle: boolean;
  ubicacionActual: string | null;
  creadoEn: string;
  actualizadoEn: string;
}
