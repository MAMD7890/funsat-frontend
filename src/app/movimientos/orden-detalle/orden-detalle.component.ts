import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { DevolucionModalComponent } from '../devolucion-modal/devolucion-modal.component';
import {
  ESTADO_ORDEN_LABEL,
  OrdenSalidaItemAccesorioResponse,
  OrdenSalidaItemResponse,
  OrdenSalidaResponse
} from '../movimiento.models';
import { MovimientoService } from '../movimiento.service';
import { OrdenFormModalComponent } from '../orden-form-modal/orden-form-modal.component';

@Component({
  selector: 'app-orden-detalle',
  templateUrl: './orden-detalle.component.html'
})
export class OrdenDetalleComponent implements OnInit {

  orden: OrdenSalidaResponse | null = null;
  cargando = true;
  estadoLabel = ESTADO_ORDEN_LABEL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movimientoService: MovimientoService,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargando = true;
    this.movimientoService.obtener(id).subscribe({
      next: orden => {
        this.orden = orden;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la orden de salida.');
        this.router.navigate(['/movimientos']);
      }
    });
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  descargarPdf(): void {
    if (!this.orden) {
      return;
    }
    this.movimientoService.descargarPdf(this.orden.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `${this.orden!.numero}.pdf`;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('No se pudo descargar el PDF.')
    });
  }

  editar(): void {
    if (!this.orden) {
      return;
    }
    const ref = this.modalService.open(OrdenFormModalComponent, { centered: true, size: 'lg' });
    ref.componentInstance.ordenId = this.orden.id;
    ref.result.then(
      () => {
        this.toastr.success('Orden actualizada correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  registrarEntrada(item: OrdenSalidaItemResponse): void {
    if (!this.orden) {
      return;
    }
    const ref = this.modalService.open(DevolucionModalComponent, { centered: true });
    ref.componentInstance.ordenId = this.orden.id;
    ref.componentInstance.item = item;
    ref.result.then(
      () => {
        this.toastr.success('Entrada registrada correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  accesoriosPendientes(item: OrdenSalidaItemResponse): OrdenSalidaItemAccesorioResponse[] {
    return item.accesorios.filter(a => !a.devuelto);
  }

  registrarEntradaAccesorio(item: OrdenSalidaItemResponse, accesorio: OrdenSalidaItemAccesorioResponse): void {
    if (!this.orden) {
      return;
    }
    const ref = this.modalService.open(DevolucionModalComponent, { centered: true });
    ref.componentInstance.ordenId = this.orden.id;
    ref.componentInstance.item = item;
    ref.componentInstance.accesorioPendiente = accesorio;
    ref.result.then(
      () => {
        this.toastr.success('Entrada de accesorio registrada correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  async eliminar(): Promise<void> {
    if (!this.orden) {
      return;
    }
    const confirmado = await this.confirmService.confirmar(
      'Eliminar orden de salida',
      `¿Eliminar la orden ${this.orden.numero}? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.movimientoService.eliminar(this.orden.id).subscribe({
      next: () => {
        this.toastr.success('Orden eliminada.');
        this.router.navigate(['/movimientos']);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar la orden.';
        this.toastr.error(mensaje);
      }
    });
  }
}
