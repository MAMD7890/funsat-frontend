export interface CostoMensual {
  mes: string;
  costoValorizado: number;
  costoRepuestos: number;
  total: number;
}

export interface EquipoCorrectivos {
  equipoId: number;
  descripcion: string;
  codigo: string | null;
  cantidad: number;
}

export interface RepuestoUso {
  nombre: string;
  cantidadTotal: number;
  costoTotal: number;
  usos: number;
}

export interface CargaTecnico {
  tecnicoId: number;
  nombre: string;
  cantidadServicios: number;
  costoTotal: number;
}

export interface ReporteResponse {
  costosPorMes: CostoMensual[];
  topEquiposCorrectivos: EquipoCorrectivos[];
  topRepuestos: RepuestoUso[];
  cargaPorTecnico: CargaTecnico[];
}
