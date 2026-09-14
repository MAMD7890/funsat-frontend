export type EstadoRecordatorio = 'PENDIENTE' | 'COMPLETADO';

export interface RecordatorioResponse {
  id: number;
  equipoId: number;
  equipoDescripcion: string;
  equipoCodigo: string | null;
  titulo: string;
  descripcion: string | null;
  fechaProgramada: string;
  estado: EstadoRecordatorio;
  vencido: boolean;
  intervaloRecurrenciaDias: number | null;
  creadoPorNombre: string | null;
}

export interface CrearRecordatorioRequest {
  equipoId: number;
  titulo: string;
  descripcion: string | null;
  fechaProgramada: string;
  intervaloRecurrenciaDias: number | null;
}

export interface EditarRecordatorioRequest {
  titulo: string;
  descripcion: string | null;
  fechaProgramada: string;
  intervaloRecurrenciaDias: number | null;
}

export interface NotificacionesRecordatorioResponse {
  vencidos: RecordatorioResponse[];
  proximos: RecordatorioResponse[];
}
