import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { EvidenciaLightboxComponent } from './evidencia-lightbox/evidencia-lightbox.component';
import { EvidenciaFotograficaResponse, TIPO_EVIDENCIA_LABEL, TipoEvidencia } from './evidencia.models';
import { EvidenciaService } from './evidencia.service';

interface EvidenciaVista {
  data: EvidenciaFotograficaResponse;
  rawUrl: string | null;
  safeUrl: SafeUrl | null;
}

const CONTENT_TYPES_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Component({
  selector: 'app-evidencia-fotografica',
  templateUrl: './evidencia-fotografica.component.html'
})
export class EvidenciaFotograficaComponent implements OnInit, OnDestroy {

  @Input() servicioId!: number;

  evidencias: EvidenciaVista[] = [];
  cargando = false;
  subiendo = false;

  archivoSeleccionado: File | null = null;
  tipoEvidencia: TipoEvidencia = 'ANTES';
  descripcion = '';

  tipoLabel = TIPO_EVIDENCIA_LABEL;

  constructor(
    private evidenciaService: EvidenciaService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.cargar();
  }

  ngOnDestroy(): void {
    this.evidencias.forEach(e => this.revocarUrl(e));
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  get antes(): EvidenciaVista[] {
    return this.evidencias.filter(e => e.data.tipoEvidencia === 'ANTES');
  }

  get despues(): EvidenciaVista[] {
    return this.evidencias.filter(e => e.data.tipoEvidencia === 'DESPUES');
  }

  cargar(): void {
    this.cargando = true;
    this.evidenciaService.listar(this.servicioId).subscribe({
      next: lista => {
        this.evidencias.forEach(e => this.revocarUrl(e));
        this.evidencias = lista.map(data => ({ data, rawUrl: null, safeUrl: null }));
        this.evidencias.forEach(vista => this.cargarImagen(vista));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la evidencia fotográfica.');
      }
    });
  }

  private cargarImagen(vista: EvidenciaVista): void {
    this.evidenciaService.descargarBlob(this.servicioId, vista.data.id).subscribe({
      next: blob => {
        vista.rawUrl = URL.createObjectURL(blob);
        vista.safeUrl = this.sanitizer.bypassSecurityTrustUrl(vista.rawUrl);
      },
      error: () => undefined
    });
  }

  private revocarUrl(vista: EvidenciaVista): void {
    if (vista.rawUrl) {
      URL.revokeObjectURL(vista.rawUrl);
    }
  }

  onArchivoSeleccionado(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (archivo && !CONTENT_TYPES_PERMITIDOS.includes(archivo.type)) {
      this.toastr.error('El archivo debe ser una imagen JPEG, PNG, WEBP o GIF.');
      input.value = '';
      this.archivoSeleccionado = null;
      return;
    }

    this.archivoSeleccionado = archivo;
  }

  subir(): void {
    if (!this.archivoSeleccionado) {
      this.toastr.error('Selecciona una imagen primero.');
      return;
    }

    this.subiendo = true;
    this.evidenciaService.subir(this.servicioId, this.archivoSeleccionado, this.tipoEvidencia, this.descripcion || null).subscribe({
      next: nueva => {
        this.subiendo = false;
        this.archivoSeleccionado = null;
        this.descripcion = '';
        const vista: EvidenciaVista = { data: nueva, rawUrl: null, safeUrl: null };
        this.evidencias.push(vista);
        this.cargarImagen(vista);
        this.toastr.success('Evidencia subida correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        this.subiendo = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.toastr.error(body?.message ?? 'No se pudo subir la evidencia.');
      }
    });
  }

  verGrande(vista: EvidenciaVista): void {
    if (!vista.safeUrl) {
      return;
    }
    const ref = this.modalService.open(EvidenciaLightboxComponent, { centered: true, size: 'lg' });
    ref.componentInstance.objectUrl = vista.safeUrl;
    ref.componentInstance.tipo = vista.data.tipoEvidencia;
    ref.componentInstance.descripcion = vista.data.descripcion;
  }

  async eliminar(vista: EvidenciaVista): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      'Eliminar evidencia',
      '¿Eliminar esta foto? Esta acción no se puede deshacer.'
    );
    if (!confirmado) {
      return;
    }

    this.evidenciaService.eliminar(this.servicioId, vista.data.id).subscribe({
      next: () => {
        this.revocarUrl(vista);
        this.evidencias = this.evidencias.filter(e => e !== vista);
        this.toastr.success('Evidencia eliminada.');
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar la evidencia.';
        this.toastr.error(mensaje);
      }
    });
  }
}
