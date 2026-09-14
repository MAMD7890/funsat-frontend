import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../core/models/api-error.model';
import { ImportResultResponse } from './importacion.models';
import { ImportacionService } from './importacion.service';

@Component({
  selector: 'app-importacion',
  templateUrl: './importacion.component.html'
})
export class ImportacionComponent {

  archivoMaster: File | null = null;
  archivoTaller: File | null = null;
  subiendoMaster = false;
  subiendoTaller = false;
  resultadoMaster: ImportResultResponse | null = null;
  resultadoTaller: ImportResultResponse | null = null;

  constructor(private importacionService: ImportacionService, private toastr: ToastrService) {
  }

  onArchivoMaster(evento: Event): void {
    this.archivoMaster = (evento.target as HTMLInputElement).files?.[0] ?? null;
    this.resultadoMaster = null;
  }

  onArchivoTaller(evento: Event): void {
    this.archivoTaller = (evento.target as HTMLInputElement).files?.[0] ?? null;
    this.resultadoTaller = null;
  }

  importarMaster(): void {
    if (!this.archivoMaster) {
      return;
    }
    this.subiendoMaster = true;
    this.importacionService.importarMaster(this.archivoMaster).subscribe({
      next: resultado => {
        this.subiendoMaster = false;
        this.resultadoMaster = resultado;
        this.toastr.success(`${resultado.filasImportadas} de ${resultado.totalFilas} filas importadas.`);
      },
      error: (err: HttpErrorResponse) => {
        this.subiendoMaster = false;
        this.toastr.error(this.mensajeError(err));
      }
    });
  }

  importarTaller(): void {
    if (!this.archivoTaller) {
      return;
    }
    this.subiendoTaller = true;
    this.importacionService.importarTaller(this.archivoTaller).subscribe({
      next: resultado => {
        this.subiendoTaller = false;
        this.resultadoTaller = resultado;
        this.toastr.success(`${resultado.filasImportadas} de ${resultado.totalFilas} filas importadas.`);
      },
      error: (err: HttpErrorResponse) => {
        this.subiendoTaller = false;
        this.toastr.error(this.mensajeError(err));
      }
    });
  }

  descargarPlantillaMaster(): void {
    this.descargarPlantilla(this.importacionService.descargarPlantillaMaster(), 'Plantilla_Inventario_Master.xlsx');
  }

  descargarPlantillaTaller(): void {
    this.descargarPlantilla(this.importacionService.descargarPlantillaTaller(), 'Plantilla_Servicio_Taller.xlsx');
  }

  private descargarPlantilla(descarga$: Observable<Blob>, nombreArchivo: string): void {
    descarga$.subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombreArchivo;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('No se pudo descargar la plantilla.')
    });
  }

  private mensajeError(err: HttpErrorResponse): string {
    const body = err.error as ApiErrorResponse | undefined;
    return body?.message ?? 'No se pudo importar el archivo.';
  }
}
