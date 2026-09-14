export interface ImportFilaError {
  fila: number;
  motivo: string;
}

export interface ImportResultResponse {
  totalFilas: number;
  filasImportadas: number;
  filasConError: number;
  errores: ImportFilaError[];
  advertencias: string[];
}
