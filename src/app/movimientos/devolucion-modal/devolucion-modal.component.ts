import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { UsuarioResumenResponse } from '../../core/models/usuario-resumen.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { OrdenSalidaItemAccesorioResponse, OrdenSalidaItemResponse } from '../movimiento.models';
import { MovimientoService } from '../movimiento.service';

@Component({
  selector: 'app-devolucion-modal',
  templateUrl: './devolucion-modal.component.html'
})
export class DevolucionModalComponent implements OnInit {

  @Input() ordenId!: number;
  @Input() item!: OrdenSalidaItemResponse;

  /** Si se define, el modal registra la entrada de este accesorio puntual (pendiente de una devolución parcial anterior) en vez del equipo completo. */
  @Input() accesorioPendiente: OrdenSalidaItemAccesorioResponse | null = null;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;
  responsables: UsuarioResumenResponse[] = [];
  accesoriosSeleccionados = new Set<number>();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private movimientoService: MovimientoService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      fechaDevolucion: [new Date().toISOString().substring(0, 10), Validators.required],
      recibidoPorId: [null, Validators.required],
      observacionDevolucion: ['']
    });
  }

  ngOnInit(): void {
    this.usuarioService.listar().subscribe(usuarios => this.responsables = usuarios);
    // Al devolver el equipo completo, todos sus accesorios aún pendientes vienen pre-seleccionados por defecto.
    this.accesoriosPendientesDelEquipo.forEach(a => this.accesoriosSeleccionados.add(a.accesorioId));
  }

  get esAccesorio(): boolean {
    return this.accesorioPendiente !== null;
  }

  get accesoriosPendientesDelEquipo(): OrdenSalidaItemAccesorioResponse[] {
    return this.item?.accesorios?.filter(a => !a.devuelto) ?? [];
  }

  alternarAccesorio(accesorioId: number): void {
    if (this.accesoriosSeleccionados.has(accesorioId)) {
      this.accesoriosSeleccionados.delete(accesorioId);
    } else {
      this.accesoriosSeleccionados.add(accesorioId);
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Revisa los campos marcados en rojo.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;

    const request = {
      ...this.form.value,
      accesorioIdsDevueltos: Array.from(this.accesoriosSeleccionados)
    };

    const accion$ = this.esAccesorio
      ? this.movimientoService.registrarDevolucionAccesorio(this.ordenId, this.item.id, this.accesorioPendiente!.id, request)
      : this.movimientoService.registrarDevolucion(this.ordenId, this.item.id, request);

    accion$.subscribe({
      next: orden => {
        this.guardando = false;
        this.activeModal.close(orden);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo registrar la devolución.';
      }
    });
  }
}
