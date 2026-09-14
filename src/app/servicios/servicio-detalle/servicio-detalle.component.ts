import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { ServicioFormModalComponent } from '../servicio-form-modal/servicio-form-modal.component';
import { ServicioResponse, TIPO_SERVICIO_LABEL } from '../servicio.models';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.component.html'
})
export class ServicioDetalleComponent implements OnInit {

  servicio: ServicioResponse | null = null;
  cargando = true;
  tipoLabel = TIPO_SERVICIO_LABEL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioService: ServicioService,
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
    this.servicioService.obtener(id).subscribe({
      next: servicio => {
        this.servicio = servicio;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar el servicio.');
        this.router.navigate(['/servicios']);
      }
    });
  }

  descargarPdf(): void {
    if (!this.servicio) {
      return;
    }
    this.servicioService.descargarPdf(this.servicio.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `${this.servicio!.numero}.pdf`;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('No se pudo descargar el PDF.')
    });
  }

  editar(): void {
    if (!this.servicio) {
      return;
    }
    const ref = this.modalService.open(ServicioFormModalComponent, { centered: true, size: 'lg' });
    ref.componentInstance.servicioId = this.servicio.id;
    ref.result.then(
      () => {
        this.toastr.success('Servicio actualizado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  get costoRepuestos(): number {
    return this.servicio?.repuestos.reduce((total, r) => total + r.costoTotal, 0) ?? 0;
  }

  async eliminar(): Promise<void> {
    if (!this.servicio) {
      return;
    }
    const confirmado = await this.confirmService.confirmar(
      'Eliminar servicio',
      '¿Eliminar este servicio? Esta acción no se puede deshacer.'
    );
    if (!confirmado) {
      return;
    }

    this.servicioService.eliminar(this.servicio.id).subscribe({
      next: () => {
        this.toastr.success('Servicio eliminado.');
        this.router.navigate(['/servicios']);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el servicio.';
        this.toastr.error(mensaje);
      }
    });
  }
}
