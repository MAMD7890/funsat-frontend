import { CategoriaCatalogoResponse } from '../catalogos/catalogo.models';
import { UsuarioResumenResponse } from '../core/models/usuario-resumen.model';

export type TipoServicio = 'ALISTAMIENTO' | 'PREVENTIVO' | 'CORRECTIVO';

export const TIPO_SERVICIO_LABEL: Record<TipoServicio, string> = {
  ALISTAMIENTO: 'Alistamiento',
  PREVENTIVO: 'Preventivo',
  CORRECTIVO: 'Correctivo'
};

export type EstadoServicio = 'REGISTRADO' | 'EN_PROGRESO' | 'EN_REVISION' | 'COMPLETADO';

export const ESTADO_SERVICIO_LABEL: Record<EstadoServicio, string> = {
  REGISTRADO: 'Por hacer',
  EN_PROGRESO: 'En progreso',
  EN_REVISION: 'En revisión',
  COMPLETADO: 'Completado'
};

export interface EquipoResumenResponse {
  id: number;
  codigo: string | null;
  descripcionEquipo: string;
  categoria: CategoriaCatalogoResponse;
  marca: string | null;
  modelo: string | null;
  numeroSerie: string | null;
}

export { UsuarioResumenResponse };

export interface ServicioRepuestoRequest {
  id?: number | null;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
}

export interface ServicioRepuestoResponse {
  id: number;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
}

export interface ServicioChecklistRespuestaRequest {
  itemId: number;
  completado: boolean;
  observacion?: string | null;
}

export interface ServicioChecklistRespuestaResponse {
  itemId: number;
  nombreItem: string;
  completado: boolean;
  observacion: string | null;
}

export interface ServicioRequest {
  equipoId: number;
  tipoServicio: TipoServicio;
  descripcion: string;
  fecha: string;
  costoValorizado: number;
  tecnicoResponsableId: number;
  repuestos: ServicioRepuestoRequest[];
  checklist: ServicioChecklistRespuestaRequest[];
}

export interface ServicioResponse {
  id: number;
  numero: string;
  equipo: EquipoResumenResponse;
  tipoServicio: TipoServicio;
  descripcion: string;
  fecha: string;
  costoValorizado: number;
  estado: EstadoServicio;
  tecnicoResponsable: UsuarioResumenResponse | null;
  repuestos: ServicioRepuestoResponse[];
  checklist: ServicioChecklistRespuestaResponse[];
  creadoEn: string;
  actualizadoEn: string;
}
