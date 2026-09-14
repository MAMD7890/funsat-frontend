import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ClienteResponse } from '../../clientes/cliente.models';
import { ClienteService } from '../../clientes/cliente.service';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { UsuarioResumenResponse } from '../../core/models/usuario-resumen.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { EquipoResponse } from '../../equipos/equipo.models';
import { EquipoService } from '../../equipos/equipo.service';
import { MovimientoService } from '../movimiento.service';

interface FilaItem {
  equipoId: number | null;
  observacionSalida: string;
  accesorioIdsSeleccionados: number[];
}

@Component({
  selector: 'app-orden-form-modal',
  templateUrl: './orden-form-modal.component.html'
})
export class OrdenFormModalComponent implements OnInit {

  @Input() ordenId: number | null = null;

  form: FormGroup;
  cargando = false;
  guardando = false;
  errorGeneral: string | null = null;

  clientes: ClienteResponse[] = [];
  responsables: UsuarioResumenResponse[] = [];
  equipos: EquipoResponse[] = [];
  equiposEnCalleIds: number[] = [];

  filas: FilaItem[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private equipoService: EquipoService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      fechaSalida: [new Date().toISOString().substring(0, 10), Validators.required],
      clienteId: [null, Validators.required],
      responsableId: [null, Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.cargando = true;
    forkJoin({
      clientes: this.clienteService.listarTodos(),
      responsables: this.usuarioService.listar(),
      equipos: this.equipoService.listarTodos(),
      enCalle: this.movimientoService.equiposEnCalle()
    }).subscribe(({ clientes, responsables, equipos, enCalle }) => {
      this.clientes = clientes.content;
      this.responsables = responsables;
      this.equipos = equipos.content;
      this.equiposEnCalleIds = enCalle;

      if (this.ordenId) {
        this.cargarOrdenExistente(this.ordenId);
      } else {
        this.cargando = false;
        this.filas = [{ equipoId: null, observacionSalida: '', accesorioIdsSeleccionados: [] }];
      }
    });
  }

  private cargarOrdenExistente(id: number): void {
    this.movimientoService.obtener(id).subscribe({
      next: orden => {
        this.form.patchValue({
          fechaSalida: orden.fechaSalida,
          clienteId: orden.cliente.id,
          responsableId: orden.responsable.id,
          observaciones: orden.observaciones
        });
        this.filas = orden.items.map(i => ({
          equipoId: i.equipoId,
          observacionSalida: i.observacionSalida || '',
          accesorioIdsSeleccionados: i.accesorios.map(a => a.accesorioId)
        }));

        // Los equipos que ya estaban en ESTA orden no cuentan como "bloqueados",
        // aunque sigan sin devolucion, porque son los que esta misma orden tiene afuera.
        const idsPropios = new Set(orden.items.map(i => i.equipoId));
        this.equiposEnCalleIds = this.equiposEnCalleIds.filter(equipoId => !idsPropios.has(equipoId));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la orden.');
        this.activeModal.dismiss();
      }
    });
  }

  get esEdicion(): boolean {
    return this.ordenId !== null;
  }

  equipoDisponible(equipo: EquipoResponse, equipoIdActual: number | null): boolean {
    return equipo.id === equipoIdActual || !this.equiposEnCalleIds.includes(equipo.id);
  }

  accesoriosDelEquipo(equipoId: number | null): { id: number; nombre: string; cantidad: number }[] {
    if (equipoId === null) {
      return [];
    }
    return this.equipos.find(e => e.id === equipoId)?.accesoriosRegistrados ?? [];
  }

  onEquipoFilaChange(fila: FilaItem): void {
    fila.accesorioIdsSeleccionados = [];
  }

  toggleAccesorio(fila: FilaItem, accesorioId: number): void {
    const indice = fila.accesorioIdsSeleccionados.indexOf(accesorioId);
    if (indice === -1) {
      fila.accesorioIdsSeleccionados.push(accesorioId);
    } else {
      fila.accesorioIdsSeleccionados.splice(indice, 1);
    }
  }

  agregarFila(): void {
    this.filas.push({ equipoId: null, observacionSalida: '', accesorioIdsSeleccionados: [] });
  }

  quitarFila(index: number): void {
    this.filas.splice(index, 1);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.filas.length === 0 || this.filas.some(f => !f.equipoId)) {
      this.toastr.error('Agrega al menos un equipo y selecciona uno en cada fila.');
      return;
    }

    const ids = this.filas.map(f => f.equipoId);
    if (new Set(ids).size !== ids.length) {
      this.toastr.error('No puedes repetir el mismo equipo en la misma orden.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;

    const request = {
      ...this.form.value,
      items: this.filas.map(f => ({
        equipoId: f.equipoId as number,
        observacionSalida: f.observacionSalida || null,
        accesorioIds: f.accesorioIdsSeleccionados
      }))
    };

    const accion$ = this.esEdicion
      ? this.movimientoService.actualizar(this.ordenId!, request)
      : this.movimientoService.crear(request);

    accion$.subscribe({
      next: orden => {
        this.guardando = false;
        this.activeModal.close(orden);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar la orden.';
      }
    });
  }
}
