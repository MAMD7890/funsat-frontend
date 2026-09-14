import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RecordatorioDiaModalComponent } from '../../recordatorios/recordatorio-dia-modal/recordatorio-dia-modal.component';
import { RecordatorioFormModalComponent } from '../../recordatorios/recordatorio-form-modal/recordatorio-form-modal.component';
import { RecordatorioResponse } from '../../recordatorios/recordatorio.models';
import { RecordatorioService } from '../../recordatorios/recordatorio.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html'
})
export class CalendarioComponent implements OnInit {

  fechaActual = new Date();
  recordatorios: RecordatorioResponse[] = [];
  cargando = false;

  nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(
    private recordatorioService: RecordatorioService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.cargar();
  }

  get nombreMes(): string {
    const texto = this.fechaActual.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  get diasDelMes(): (number | null)[] {
    const anio = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();
    const primerDiaSemana = new Date(anio, mes, 1).getDay();
    const totalDias = new Date(anio, mes + 1, 0).getDate();

    const celdas: (number | null)[] = [];
    for (let i = 0; i < primerDiaSemana; i++) {
      celdas.push(null);
    }
    for (let d = 1; d <= totalDias; d++) {
      celdas.push(d);
    }
    return celdas;
  }

  private dosDigitos(valor: number): string {
    return valor < 10 ? '0' + valor : String(valor);
  }

  private formatearFecha(anio: number, mesIndiceCero: number, dia: number): string {
    return `${anio}-${this.dosDigitos(mesIndiceCero + 1)}-${this.dosDigitos(dia)}`;
  }

  cargar(): void {
    const anio = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();
    const totalDias = new Date(anio, mes + 1, 0).getDate();
    const desde = this.formatearFecha(anio, mes, 1);
    const hasta = this.formatearFecha(anio, mes, totalDias);

    this.cargando = true;
    this.recordatorioService.listarPorRango(desde, hasta).subscribe({
      next: recordatorios => {
        this.recordatorios = recordatorios;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar el calendario de mantenimientos.');
      }
    });
  }

  recordatoriosDelDia(dia: number | null): RecordatorioResponse[] {
    if (dia === null) {
      return [];
    }
    const fecha = this.formatearFecha(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), dia);
    return this.recordatorios.filter(r => r.fechaProgramada === fecha);
  }

  claseEstado(r: RecordatorioResponse): 'vencido' | 'completado' | 'pendiente' {
    if (r.estado === 'COMPLETADO') {
      return 'completado';
    }
    return r.vencido ? 'vencido' : 'pendiente';
  }

  mesAnterior(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() - 1, 1);
    this.cargar();
  }

  mesSiguiente(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 1);
    this.cargar();
  }

  seleccionarDia(dia: number | null): void {
    if (dia === null) {
      return;
    }
    const fecha = this.formatearFecha(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), dia);
    const tituloFecha = `${dia} de ${this.nombreMes}`;

    const ref = this.modalService.open(RecordatorioDiaModalComponent, { centered: true, size: 'lg' });
    ref.componentInstance.fecha = fecha;
    ref.componentInstance.tituloFecha = tituloFecha;
    // Se refresca el grid al cerrar sin importar cómo (X, backdrop, Escape o
    // el botón de cerrar): cualquier acción dentro del modal pudo cambiar
    // los puntos de color, y recargar es barato.
    ref.result.then(() => this.cargar(), () => this.cargar());
  }

  nuevoRecordatorio(): void {
    const ref = this.modalService.open(RecordatorioFormModalComponent, { centered: true });
    ref.result.then(
      () => {
        this.toastr.success('Recordatorio creado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }
}
