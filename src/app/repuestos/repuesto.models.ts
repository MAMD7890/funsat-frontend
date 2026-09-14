export interface RepuestoRequest {
  nombre: string;
  codigo?: string | null;
  costoUnitario: number;
  stockDisponible: number;
}

export interface RepuestoResponse {
  id: number;
  nombre: string;
  codigo: string | null;
  costoUnitario: number;
  stockDisponible: number;
}
