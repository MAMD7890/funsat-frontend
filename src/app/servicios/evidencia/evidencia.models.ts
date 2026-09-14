export type TipoEvidencia = 'ANTES' | 'DESPUES';

export const TIPO_EVIDENCIA_LABEL: Record<TipoEvidencia, string> = {
  ANTES: 'Antes',
  DESPUES: 'Después'
};

export interface EvidenciaFotograficaResponse {
  id: number;
  servicioId: number;
  tipoEvidencia: TipoEvidencia;
  nombreOriginal: string | null;
  contentType: string | null;
  tamanoBytes: number | null;
  descripcion: string | null;
  fecha: string;
  url: string;
}
