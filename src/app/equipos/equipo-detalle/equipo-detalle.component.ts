import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { EquipoFormModalComponent } from '../equipo-form-modal/equipo-form-modal.component';
import { ESTADO_EQUIPO_LABEL, ESTADO_SERVICIO_TALLER_LABEL, EquipoResponse, PROPIEDAD_LABEL } from '../equipo.models';
import { EquipoService } from '../equipo.service';

@Component({
  selector: 'app-equipo-detalle',
  templateUrl: './equipo-detalle.component.html'
})
export class EquipoDetalleComponent implements OnInit {

  equipo: EquipoResponse | null = null;
  cargando = true;

  estadoLabel = ESTADO_EQUIPO_LABEL;
  propiedadLabel = PROPIEDAD_LABEL;
  estadoServicioTallerLabel = ESTADO_SERVICIO_TALLER_LABEL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipoService: EquipoService,
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
    this.equipoService.obtener(id).subscribe({
      next: equipo => {
        this.equipo = equipo;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar el equipo.');
        this.router.navigate(['/equipos']);
      }
    });
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  editar(): void {
    if (!this.equipo) {
      return;
    }
    const ref = this.modalService.open(EquipoFormModalComponent, { centered: true, size: 'lg' });
    ref.componentInstance.equipoId = this.equipo.id;
    ref.result.then(
      () => {
        this.toastr.success('Equipo actualizado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  async eliminar(): Promise<void> {
    if (!this.equipo) {
      return;
    }
    const confirmado = await this.confirmService.confirmar(
      'Eliminar equipo',
      `¿Eliminar "${this.equipo.descripcionEquipo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.equipoService.eliminar(this.equipo.id).subscribe({
      next: () => {
        this.toastr.success('Equipo eliminado.');
        this.router.navigate(['/equipos']);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el equipo.';
        this.toastr.error(mensaje);
      }
    });
  }
}
