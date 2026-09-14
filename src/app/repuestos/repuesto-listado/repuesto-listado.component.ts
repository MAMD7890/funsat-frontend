import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { PageResponse } from '../../core/models/page.model';
import { RepuestoFormModalComponent } from '../repuesto-form-modal/repuesto-form-modal.component';
import { RepuestoResponse } from '../repuesto.models';
import { RepuestoService } from '../repuesto.service';

@Component({
  selector: 'app-repuesto-listado',
  templateUrl: './repuesto-listado.component.html'
})
export class RepuestoListadoComponent implements OnInit {

  page: PageResponse<RepuestoResponse> | null = null;
  cargando = false;

  constructor(
    private repuestoService: RepuestoService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.cargar(0);
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  cargar(pagina: number): void {
    this.cargando = true;
    this.repuestoService.listar(pagina).subscribe({
      next: page => {
        this.page = page;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la lista de repuestos.');
      }
    });
  }

  nuevoRepuesto(): void {
    const ref = this.modalService.open(RepuestoFormModalComponent, { centered: true });
    ref.result.then(
      () => {
        this.toastr.success('Repuesto creado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  editarRepuesto(repuesto: RepuestoResponse): void {
    const ref = this.modalService.open(RepuestoFormModalComponent, { centered: true });
    ref.componentInstance.repuesto = repuesto;
    ref.result.then(
      () => {
        this.toastr.success('Repuesto actualizado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  async eliminarRepuesto(repuesto: RepuestoResponse): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      'Eliminar repuesto',
      `¿Eliminar "${repuesto.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.repuestoService.eliminar(repuesto.id).subscribe({
      next: () => {
        this.toastr.success('Repuesto eliminado.');
        this.cargar(this.page?.number ?? 0);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el repuesto.';
        this.toastr.error(mensaje);
      }
    });
  }
}
