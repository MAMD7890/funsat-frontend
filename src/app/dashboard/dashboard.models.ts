import { Propiedad } from '../equipos/equipo.models';
import { EstadoServicio, TipoServicio } from '../servicios/servicio.models';

export interface DashboardCategoriaConteo {
  categoriaId: number;
  categoriaNombre: string;
  cantidad: number;
}

export interface DashboardEquiposResumen {
  total: number;
  activos: number;
  inactivos: number;
  enMantenimiento: number;
  dadosDeBaja: number;
  enAlmacen: number;
  enCalle: number;
  porCategoria: DashboardCategoriaConteo[];
  porPropiedad: Partial<Record<Propiedad, number>>;
}

export interface DashboardServiciosResumen {
  total: number;
  porEstado: Partial<Record<EstadoServicio, number>>;
  porTipo: Partial<Record<TipoServicio, number>>;
  costoTotalHistorico: number;
  costoMesActual: number;
}

export interface DashboardMantenimientosResumen {
  vencidos: number;
  proximos7Dias: number;
}

export interface DashboardServicioReciente {
  id: number;
  numero: string;
  equipoDescripcion: string;
  tipoServicio: TipoServicio;
  estado: EstadoServicio;
  fecha: string;
  tecnicoNombre: string | null;
}

export interface DashboardEquipoEnCalle {
  equipoId: number;
  equipoDescripcion: string;
  equipoCodigo: string | null;
  clienteNombre: string;
  fechaSalida: string;
  diasFuera: number;
  enAlerta: boolean;
}

export interface DashboardEquiposEnCalleResumen {
  total: number;
  enAlerta: number;
  diasFueraAlerta: number;
}

export interface DashboardResponse {
  equipos: DashboardEquiposResumen;
  servicios: DashboardServiciosResumen;
  mantenimientos: DashboardMantenimientosResumen;
  equiposEnCalleResumen: DashboardEquiposEnCalleResumen;
  serviciosRecientes: DashboardServicioReciente[];
  equiposEnCalle: DashboardEquipoEnCalle[];
}
