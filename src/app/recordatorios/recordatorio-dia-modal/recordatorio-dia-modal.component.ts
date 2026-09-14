import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { RecordatorioFormModalComponent } from '../recordatorio-form-modal/recordatorio-form-modal.component';
import { RecordatorioResponse } from '../recordatorio.models';
import { RecordatorioService } from '../recordatorio.service';

@Component({
  selector: 'app-recordatorio-dia-modal',
  templateUrl: './recordatorio-dia-modal.component.html'
})
export class RecordatorioDiaModalComponent implements OnInit {

  /** Fecha ISO (AAAA-MM-DD) del día seleccionado. */
  @Input() fecha!: string;
  /** Texto ya formateado para el título, ej. "19 de Agosto de 2026". */
  @Input() tituloFecha = '';

  recordatorios: RecordatorioResponse[] = [];
  cargando = false;

  constructor(
    public activeModal: NgbActiveModal,
    private recordatorioService: RecordatorioService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.cargar();
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  cargar(): void {
    this.cargando = true;
    this.recordatorioService.listarPorRango(this.fecha, this.fecha).subscribe({
      next: recordatorios => {
        this.recordatorios = recordatorios;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar los recordatorios de este día.');
      }
    });
  }

  claseEstado(r: RecordatorioResponse): 'vencido' | 'completado' | 'pendiente' {
    if (r.estado === 'COMPLETADO') {
      return 'completado';
    }
    return r.vencido ? 'vencido' : 'pendiente';
  }

  cerrar(): void {
    this.activeModal.dismiss();
  }

  nuevoRecordatorio(): void {
    const ref = this.modalService.open(RecordatorioFormModalComponent, { centered: true });
    ref.componentInstance.fechaInicial = this.fecha;
    ref.result.then(
      () => {
        this.toastr.success('Recordatorio creado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  editarRecordatorio(recordatorio: RecordatorioResponse): void {
    const ref = this.modalService.open(RecordatorioFormModalComponent, { centered: true });
    ref.componentInstance.recordatorio = recordatorio;
    ref.result.then(
      () => {
        this.toastr.success('Recordatorio actualizado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  completarRecordatorio(recordatorio: RecordatorioResponse): void {
    this.recordatorioService.completar(recordatorio.id).subscribe({
      next: () => {
        const mensaje = recordatorio.intervaloRecurrenciaDias
          ? 'Recordatorio cumplido. Se programó el siguiente automáticamente.'
          : 'Recordatorio marcado como cumplido.';
        this.toastr.success(mensaje);
        this.cargar();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? 'No se pudo completar el recordatorio.')
    });
  }

  async eliminarRecordatorio(recordatorio: RecordatorioResponse): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      'Eliminar recordatorio',
      `¿Eliminar "${recordatorio.titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.recordatorioService.eliminar(recordatorio.id).subscribe({
      next: () => {
        this.toastr.success('Recordatorio eliminado.');
        this.cargar();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? 'No se pudo eliminar el recordatorio.')
    });
  }
}
