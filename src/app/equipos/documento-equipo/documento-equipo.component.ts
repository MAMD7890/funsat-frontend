import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { ConfirmService } from '../../core/services/confirm.service';
import { DocumentoEquipoResponse, TIPO_DOCUMENTO_EQUIPO_LABEL, TipoDocumentoEquipo } from './documento-equipo.models';
import { DocumentoEquipoService } from './documento-equipo.service';

const CONTENT_TYPES_PERMITIDOS = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

@Component({
  selector: 'app-documento-equipo',
  templateUrl: './documento-equipo.component.html'
})
export class DocumentoEquipoComponent implements OnInit {

  @Input() equipoId!: number;

  documentos: DocumentoEquipoResponse[] = [];
  cargando = false;
  subiendo = false;

  archivoSeleccionado: File | null = null;
  tipoDocumento: TipoDocumentoEquipo = 'OTRO';
  descripcion = '';

  tipoLabel = TIPO_DOCUMENTO_EQUIPO_LABEL;

  constructor(
    private documentoService: DocumentoEquipoService,
    private confirmService: ConfirmService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.documentoService.listar(this.equipoId).subscribe({
      next: lista => {
        this.documentos = lista;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar los documentos del equipo.');
      }
    });
  }

  onArchivoSeleccionado(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (archivo && !CONTENT_TYPES_PERMITIDOS.includes(archivo.type)) {
      this.toastr.error('El archivo debe ser PDF, imagen (JPEG/PNG/WEBP) o documento de Word/Excel.');
      input.value = '';
      this.archivoSeleccionado = null;
      return;
    }

    this.archivoSeleccionado = archivo;
  }

  subir(): void {
    if (!this.archivoSeleccionado) {
      this.toastr.error('Selecciona un archivo primero.');
      return;
    }

    this.subiendo = true;
    this.documentoService.subir(this.equipoId, this.archivoSeleccionado, this.tipoDocumento, this.descripcion || null).subscribe({
      next: nuevo => {
        this.subiendo = false;
        this.archivoSeleccionado = null;
        this.descripcion = '';
        this.documentos.unshift(nuevo);
        this.toastr.success('Documento subido correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        this.subiendo = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.toastr.error(body?.message ?? 'No se pudo subir el documento.');
      }
    });
  }

  descargar(documento: DocumentoEquipoResponse): void {
    this.documentoService.descargarBlob(this.equipoId, documento.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = documento.nombreOriginal || 'documento';
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('No se pudo descargar el documento.')
    });
  }

  async eliminar(documento: DocumentoEquipoResponse): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      'Eliminar documento',
      `¿Eliminar "${documento.nombreOriginal}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.documentoService.eliminar(this.equipoId, documento.id).subscribe({
      next: () => {
        this.documentos = this.documentos.filter(d => d.id !== documento.id);
        this.toastr.success('Documento eliminado.');
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el documento.';
        this.toastr.error(mensaje);
      }
    });
  }

  icono(documento: DocumentoEquipoResponse): string {
    const tipo = documento.contentType || '';
    if (tipo === 'application/pdf') {
      return 'fa-file-pdf';
    }
    if (tipo.startsWith('image/')) {
      return 'fa-file-image';
    }
    if (tipo.includes('word')) {
      return 'fa-file-word';
    }
    if (tipo.includes('excel') || tipo.includes('spreadsheet')) {
      return 'fa-file-excel';
    }
    return 'fa-file';
  }

  tamanoLegible(bytes: number | null): string {
    if (bytes === null || bytes === undefined) {
      return '';
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
