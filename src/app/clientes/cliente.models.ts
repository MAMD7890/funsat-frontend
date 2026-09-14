export type TipoCliente = 'NATURAL' | 'EMPRESA';

export interface ClienteRequest {
  nombre: string;
  tipo: TipoCliente;
  telefono?: string | null;
  email?: string | null;
}

export interface ClienteResponse {
  id: number;
  nombre: string;
  tipo: TipoCliente;
  telefono: string | null;
  email: string | null;
}

export const TIPO_CLIENTE_LABEL: Record<TipoCliente, string> = {
  NATURAL: 'Natural',
  EMPRESA: 'Empresa'
};
