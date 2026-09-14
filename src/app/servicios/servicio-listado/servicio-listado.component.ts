import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BusquedaGlobalService } from '../../core/services/busqueda-global.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { PageResponse } from '../../core/models/page.model';
import { ServicioFormModalComponent } from '../servicio-form-modal/servicio-form-modal.component';
import { FiltrosServicio, ServicioService } from '../servicio.service';
import { ServicioResponse, TIPO_SERVICIO_LABEL, TipoServicio } from '../servicio.models';

@Component({
  selector: 'app-servicio-listado',
  templateUrl: './servicio-listado.component.html'
})
export class ServicioListadoComponent implements OnInit, OnDestroy {

  page: PageResponse<ServicioResponse> | null = null;
  cargando = false;
  tipoLabel = TIPO_SERVICIO_LABEL;
  tipos: TipoServicio[] = ['ALISTAMIENTO', 'PREVENTIVO', 'CORRECTIVO'];

  filtros: FiltrosServicio = {};
  equipoDescripcion: string | null = null;

  private busquedaSub?: Subscription;
  private cargaSub?: Subscription;

  constructor(
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService,
    private modalService: NgbModal,
    private busquedaGlobal: BusquedaGlobalService
  ) {
  }

  ngOnInit(): void {
    const equipoId = this.route.snapshot.queryParamMap.get('equipoId');
    if (equipoId) {
      this.filtros.equipoId = Number(equipoId);
    }
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
    this.cargaSub = this.servicioService.listar(pagina, this.filtros).subscribe({
      next: page => {
        this.page = page;
        this.cargando = false;
        this.equipoDescripcion = page.content[0]?.equipo?.descripcionEquipo ?? this.equipoDescripcion;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la lista de servicios.');
      }
    });
  }

  aplicarFiltros(): void {
    this.cargar(0);
  }

  limpiarFiltros(): void {
    this.filtros = { q: this.busquedaGlobal.terminoActual || null };
    this.equipoDescripcion = null;
    this.router.navigate(['/servicios']);
    this.cargar(0);
  }

  irADetalle(servicio: ServicioResponse): void {
    this.router.navigate(['/servicios', servicio.id]);
  }

  nuevoServicio(): void {
    const ref = this.modalService.open(ServicioFormModalComponent, { centered: true, size: 'lg' });
    ref.result.then(
      () => {
        this.toastr.success('Servicio creado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  irAEditar(servicio: ServicioResponse, evento: Event): void {
    evento.stopPropagation();
    const ref = this.modalService.open(ServicioFormModalComponent, { centered: true, size: 'lg' });
    ref.componentInstance.servicioId = servicio.id;
    ref.result.then(
      () => {
        this.toastr.success('Servicio actualizado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  async eliminar(servicio: ServicioResponse, evento: Event): Promise<void> {
    evento.stopPropagation();
    const confirmado = await this.confirmService.confirmar(
      'Eliminar servicio',
      `¿Eliminar este servicio de "${servicio.equipo.descripcionEquipo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.servicioService.eliminar(servicio.id).subscribe({
      next: () => {
        this.toastr.success('Servicio eliminado.');
        this.cargar(this.page?.number ?? 0);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el servicio.';
        this.toastr.error(mensaje);
      }
    });
  }
}
