import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BusquedaGlobalService } from '../../core/services/busqueda-global.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { PageResponse } from '../../core/models/page.model';
import { EquipoFormModalComponent } from '../equipo-form-modal/equipo-form-modal.component';
import { ESTADO_EQUIPO_LABEL, EquipoResponse, EstadoEquipo, PROPIEDAD_LABEL } from '../equipo.models';
import { EquipoService, FiltrosEquipo } from '../equipo.service';
import { CategoriaCatalogoResponse } from '../../catalogos/catalogo.models';
import { CategoriaCatalogoService } from '../../catalogos/catalogo.service';

@Component({
  selector: 'app-equipo-listado',
  templateUrl: './equipo-listado.component.html'
})
export class EquipoListadoComponent implements OnInit, OnDestroy {

  page: PageResponse<EquipoResponse> | null = null;
  cargando = false;

  estadoLabel = ESTADO_EQUIPO_LABEL;
  propiedadLabel = PROPIEDAD_LABEL;
  categorias: CategoriaCatalogoResponse[] = [];
  estados: EstadoEquipo[] = ['ACTIVO', 'INACTIVO', 'EN_MANTENIMIENTO', 'DADO_DE_BAJA'];

  filtros: FiltrosEquipo = {};

  private busquedaSub?: Subscription;
  private cargaSub?: Subscription;

  constructor(
    private equipoService: EquipoService,
    private router: Router,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService,
    private modalService: NgbModal,
    private busquedaGlobal: BusquedaGlobalService,
    private categoriaCatalogoService: CategoriaCatalogoService
  ) {
  }

  ngOnInit(): void {
    this.busquedaSub = this.busquedaGlobal.termino$.subscribe(termino => {
      this.filtros.q = termino || null;
      this.cargar(0);
    });
    this.categoriaCatalogoService.listar().subscribe(categorias => this.categorias = categorias);
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
    this.cargaSub = this.equipoService.listar(pagina, this.filtros).subscribe({
      next: page => {
        this.page = page;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la lista de equipos.');
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

  irADetalle(equipo: EquipoResponse): void {
    this.router.navigate(['/equipos', equipo.id]);
  }

  nuevoEquipo(): void {
    const ref = this.modalService.open(EquipoFormModalComponent, { centered: true, size: 'lg' });
    ref.result.then(
      () => {
        this.toastr.success('Equipo creado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  irAEditar(equipo: EquipoResponse, evento: Event): void {
    evento.stopPropagation();
    const ref = this.modalService.open(EquipoFormModalComponent, { centered: true, size: 'lg' });
    ref.componentInstance.equipoId = equipo.id;
    ref.result.then(
      () => {
        this.toastr.success('Equipo actualizado correctamente.');
        this.cargar(this.page?.number ?? 0);
      },
      () => undefined
    );
  }

  async eliminar(equipo: EquipoResponse, evento: Event): Promise<void> {
    evento.stopPropagation();
    const confirmado = await this.confirmService.confirmar(
      'Eliminar equipo',
      `¿Eliminar "${equipo.descripcionEquipo}" (${equipo.codigo || equipo.codigoTaller || 'sin código'})?`
    );
    if (!confirmado) {
      return;
    }

    this.equipoService.eliminar(equipo.id).subscribe({
      next: () => {
        this.toastr.success('Equipo eliminado.');
        this.cargar(this.page?.number ?? 0);
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el equipo.';
        this.toastr.error(mensaje);
      }
    });
  }
}
