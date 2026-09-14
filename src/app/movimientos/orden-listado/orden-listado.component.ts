import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BusquedaGlobalService } from '../../core/services/busqueda-global.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { PageResponse } from '../../core/models/page.model';
import { ESTADO_ORDEN_LABEL, OrdenSalidaResponse } from '../movimiento.models';
import { FiltrosOrdenSalida, MovimientoService } from '../movimiento.service';
import { OrdenFormModalComponent } from '../orden-form-modal/orden-form-modal.component';

@Component({
  selector: 'app-orden-listado',
  templateUrl: './orden-listado.component.html'
})
export class OrdenListadoComponent implements OnInit, OnDestroy {

  page: PageResponse<OrdenSalidaResponse> | null = null;
  cargando = false;
  estadoLabel = ESTADO_ORDEN_LABEL;

  filtros: FiltrosOrdenSalida = {};

  private busquedaSub?: Subscription;
  private cargaSub?: Subscription;

  constructor(
    private movimientoService: MovimientoService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService,
    private busquedaGlobal: BusquedaGlobalService
  ) {
  }

  ngOnInit(): void {
    this.busquedaSub = this.busquedaGlobal.termino$.subscribe(termino => {
      this.filtros.q = termino || null;
      this.cargar(0);
    });
  }

  ngOnDestroy(): void {
    this.busquedaSub?.unsubscribe();
    this.cargaSub?.unsubscribe();
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  cargar(pagina: number): void {
    this.cargaSub?.unsubscribe();
    this.cargando = true;
    this.cargaSub = this.movimientoService.listar(pagina, this.filtros).subscribe({
      next: page => {
        this.page = page;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la lista de órdenes de salida.');
      }
    });
  }

  aplicarFiltros(): void {
    this.cargar(0);
  }

  limpiarFiltros(): void {
    this.filtros = { q: this.busquedaGlobal.terminoActual || null };
    this.cargar(0);
  }

  nuevaOrden(): void {
    const ref = this.modalService.open(OrdenFormModalComponent, { centered: true, size: 'lg' });
    ref.result.then(
      () => {
        this.toastr.success('Orden de salida creada correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  descargarPdf(orden: OrdenSalidaResponse): void {
    this.movimientoService.descargarPdf(orden.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `${orden.numero}.pdf`;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('No se pudo descargar el PDF.')
    });
  }

  async eliminar(orden: OrdenSalidaResponse): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      'Eliminar orden de salida',
      `¿Eliminar la orden ${orden.numero}? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.movimientoService.eliminar(orden.id).subscribe({
      next: () => {
        this.toastr.success('Orden eliminada.');
        this.cargar(this.page?.number ?? 0);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar la orden.';
        this.toastr.error(mensaje);
      }
    });
  }
}
