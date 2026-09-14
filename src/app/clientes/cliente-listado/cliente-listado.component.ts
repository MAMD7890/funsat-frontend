import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BusquedaGlobalService } from '../../core/services/busqueda-global.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { PageResponse } from '../../core/models/page.model';
import { ClienteFormModalComponent } from '../cliente-form-modal/cliente-form-modal.component';
import { ClienteResponse, TIPO_CLIENTE_LABEL } from '../cliente.models';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-cliente-listado',
  templateUrl: './cliente-listado.component.html'
})
export class ClienteListadoComponent implements OnInit, OnDestroy {

  page: PageResponse<ClienteResponse> | null = null;
  cargando = false;
  tipoLabel = TIPO_CLIENTE_LABEL;
  terminoBusqueda: string | null = null;

  private busquedaSub?: Subscription;
  private cargaSub?: Subscription;

  constructor(
    private clienteService: ClienteService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService,
    private busquedaGlobal: BusquedaGlobalService
  ) {
  }

  ngOnInit(): void {
    this.busquedaSub = this.busquedaGlobal.termino$.subscribe(termino => {
      this.terminoBusqueda = termino || null;
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
    this.cargaSub = this.clienteService.listar(pagina, 20, this.terminoBusqueda).subscribe({
      next: page => {
        this.page = page;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la lista de clientes.');
      }
    });
  }

  nuevoCliente(): void {
    const ref = this.modalService.open(ClienteFormModalComponent, { centered: true });
    ref.result.then(
      () => {
        this.toastr.success('Cliente creado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  editarCliente(cliente: ClienteResponse): void {
    const ref = this.modalService.open(ClienteFormModalComponent, { centered: true });
    ref.componentInstance.cliente = cliente;
    ref.result.then(
      () => {
        this.toastr.success('Cliente actualizado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  async eliminarCliente(cliente: ClienteResponse): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      'Eliminar cliente',
      `¿Eliminar a "${cliente.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.clienteService.eliminar(cliente.id).subscribe({
      next: () => {
        this.toastr.success('Cliente eliminado.');
        this.cargar(this.page?.number ?? 0);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el cliente.';
        this.toastr.error(mensaje);
      }
    });
  }
}
