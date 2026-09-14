import { ClienteResponse } from '../clientes/cliente.models';
import { UsuarioResumenResponse } from '../core/models/usuario-resumen.model';

export type EstadoOrdenSalida = 'ABIERTA' | 'PARCIAL' | 'CERRADA';

export const ESTADO_ORDEN_LABEL: Record<EstadoOrdenSalida, string> = {
  ABIERTA: 'Abierta',
  PARCIAL: 'Parcial',
  CERRADA: 'Cerrada'
};

/** Un accesorio que salió con este item, con su propio estado de devolución (independiente del equipo). */
export interface OrdenSalidaItemAccesorioResponse {
  id: number;
  accesorioId: number;
  nombre: string;
  cantidad: number;
  devuelto: boolean;
  fechaDevolucion: string | null;
  recibidoPor: UsuarioResumenResponse | null;
  observacionDevolucion: string | null;
}

export interface OrdenSalidaItemResponse {
  id: number;
  equipoId: number;
  equipoDescripcion: string;
  equipoCodigo: string | null;
  equipoMarca: string | null;
  equipoNumeroSerie: string | null;
  observacionSalida: string | null;
  accesorios: OrdenSalidaItemAccesorioResponse[];
  devuelto: boolean;
  fechaDevolucion: string | null;
  recibidoPor: UsuarioResumenResponse | null;
  observacionDevolucion: string | null;
}

export interface OrdenSalidaResponse {
  id: number;
  numero: string;
  fechaSalida: string;
  cliente: ClienteResponse;
  responsable: UsuarioResumenResponse;
  observaciones: string | null;
  estado: EstadoOrdenSalida;
  items: OrdenSalidaItemResponse[];
  creadoPorNombre: string | null;
  creadoEn: string;
}

export interface OrdenSalidaItemRequest {
  equipoId: number;
  observacionSalida: string | null;
  accesorioIds: number[];
}

export interface OrdenSalidaRequest {
  fechaSalida: string;
  clienteId: number;
  responsableId: number;
  observaciones: string | null;
  items: OrdenSalidaItemRequest[];
}

export interface RegistrarDevolucionRequest {
  fechaDevolucion: string;
  recibidoPorId: number;
  observacionDevolucion: string | null;
  /** Solo aplica al devolver el equipo completo: ids de EquipoAccesorio que vuelven junto con él ahora. */
  accesorioIdsDevueltos?: number[];
}
