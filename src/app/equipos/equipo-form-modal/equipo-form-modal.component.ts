import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClienteResponse } from '../../clientes/cliente.models';
import { ClienteService } from '../../clientes/cliente.service';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { limpiarBlancos } from '../../core/utils/form.utils';
import {
  EquipoAccesorioRequest,
  ESTADO_EQUIPO_LABEL,
  ESTADO_SERVICIO_TALLER_LABEL,
  EstadoEquipo,
  EstadoServicioTaller
} from '../equipo.models';
import { EquipoService } from '../equipo.service';
import { validarEquipoForm } from './equipo-form.validators';
import { CategoriaCatalogoResponse, TipoMotorCatalogoResponse } from '../../catalogos/catalogo.models';
import { CategoriaCatalogoService, TipoMotorCatalogoService } from '../../catalogos/catalogo.service';

@Component({
  selector: 'app-equipo-form-modal',
  templateUrl: './equipo-form-modal.component.html'
})
export class EquipoFormModalComponent implements OnInit {

  @Input() equipoId: number | null = null;

  form: FormGroup;
  cargando = false;
  guardando = false;
  errorGeneral: string | null = null;
  clientes: ClienteResponse[] = [];
  accesoriosFilas: EquipoAccesorioRequest[] = [];

  categorias: CategoriaCatalogoResponse[] = [];
  estados: EstadoEquipo[] = ['ACTIVO', 'INACTIVO', 'EN_MANTENIMIENTO', 'DADO_DE_BAJA'];
  motores: TipoMotorCatalogoResponse[] = [];
  estadosServicioTaller: EstadoServicioTaller[] = [
    'PENDIENTE_POR_DIAGNOSTICO', 'POR_INICIAR_SERVICIO', 'POR_APROBAR', 'POR_DEFINIR', 'STAND_BY',
    'SIN_CANCELAR_Y_REPARADO', 'PENDIENTE_REMISION', 'PENDIENTE_POR_FACTURA_Y_ENTREGA', 'REPARADA_POR_RETIRAR'
  ];

  estadoLabel = ESTADO_EQUIPO_LABEL;
  estadoServicioTallerLabel = ESTADO_SERVICIO_TALLER_LABEL;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private equipoService: EquipoService,
    private clienteService: ClienteService,
    private categoriaCatalogoService: CategoriaCatalogoService,
    private tipoMotorCatalogoService: TipoMotorCatalogoService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      codigo: [''],
      codigoTaller: [''],
      descripcionEquipo: ['', [Validators.required, Validators.maxLength(200)]],
      categoriaId: [null, Validators.required],
      marca: [''],
      numeroSerie: [''],
      modelo: [''],
      motorId: [null],
      ubicacion: [''],
      estado: ['ACTIVO'],
      checkMtto: [false],
      checkHv: [false],
      checkFt: [false],
      propiedad: ['PROPIO', Validators.required],
      clienteId: [null],
      accesorios: [''],
      fechaIngreso: [null],
      fechaDiagnostico: [null],
      rotulado: [false],
      estadoServicioTaller: [null]
    }, { validators: validarEquipoForm(() => this.categorias) });
  }

  ngOnInit(): void {
    this.clienteService.listarTodos().subscribe(page => this.clientes = page.content);
    this.tipoMotorCatalogoService.listar().subscribe(motores => this.motores = motores);
    this.categoriaCatalogoService.listar().subscribe(categorias => {
      this.categorias = categorias;
      if (!this.equipoId && categorias.length > 0) {
        this.form.patchValue({ categoriaId: categorias[0].id });
      }
    });

    if (this.equipoId) {
      this.cargando = true;
      this.equipoService.obtener(this.equipoId).subscribe({
        next: equipo => {
          this.cargando = false;
          this.form.patchValue({
            ...equipo,
            categoriaId: equipo.categoria.id,
            motorId: equipo.motor?.id ?? null,
            clienteId: equipo.cliente?.id ?? null
          });
          this.accesoriosFilas = equipo.accesoriosRegistrados.map(a => ({ id: a.id, nombre: a.nombre, cantidad: a.cantidad }));
        },
        error: () => {
          this.cargando = false;
          this.toastr.error('No se pudo cargar el equipo.');
          this.activeModal.dismiss();
        }
      });
    }
  }

  get esEdicion(): boolean {
    return this.equipoId !== null;
  }

  get esExterno(): boolean {
    return this.form.get('propiedad')?.value === 'EXTERNO';
  }

  onPropiedadChange(): void {
    if (!this.esExterno) {
      this.form.patchValue({ clienteId: null, fechaIngreso: null });
    }
  }

  agregarAccesorio(): void {
    this.accesoriosFilas.push({ id: null, nombre: '', cantidad: 1 });
  }

  quitarAccesorio(index: number): void {
    this.accesoriosFilas.splice(index, 1);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const filaInvalida = this.accesoriosFilas.some(a => !a.nombre || !a.nombre.trim());
    if (filaInvalida) {
      this.toastr.error('Revisa los accesorios: falta el nombre en alguna fila.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;
    const request = {
      ...limpiarBlancos(this.form.value),
      accesoriosRegistrados: this.accesoriosFilas.map(a => ({ id: a.id ?? null, nombre: a.nombre.trim(), cantidad: a.cantidad || 1 }))
    };

    const accion$ = this.esEdicion
      ? this.equipoService.actualizar(this.equipoId!, request)
      : this.equipoService.crear(request);

    accion$.subscribe({
      next: equipo => {
        this.guardando = false;
        this.activeModal.close(equipo);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el equipo.';
      }
    });
  }
}
