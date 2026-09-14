export type TipoDocumentoEquipo = 'MANUAL' | 'FACTURA' | 'GARANTIA' | 'OTRO';

export const TIPO_DOCUMENTO_EQUIPO_LABEL: Record<TipoDocumentoEquipo, string> = {
  MANUAL: 'Manual',
  FACTURA: 'Factura',
  GARANTIA: 'Garantía',
  OTRO: 'Otro'
};

export interface DocumentoEquipoResponse {
  id: number;
  equipoId: number;
  tipoDocumento: TipoDocumentoEquipo;
  nombreOriginal: string | null;
  contentType: string | null;
  tamanoBytes: number | null;
  descripcion: string | null;
  fecha: string;
  url: string;
}
