import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ChecklistItemService } from '../../checklist/checklist-item.service';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { UsuarioResumenResponse } from '../../core/models/usuario-resumen.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { EquipoService } from '../../equipos/equipo.service';
import {
  EquipoResumenResponse,
  ServicioChecklistRespuestaResponse,
  ServicioRequest,
  TIPO_SERVICIO_LABEL,
  TipoServicio
} from '../servicio.models';
import { ServicioService } from '../servicio.service';

interface FilaRepuesto {
  id: number | null;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
}

interface FilaChecklist {
  itemId: number;
  nombre: string;
  completado: boolean;
  observacion: string;
}

@Component({
  selector: 'app-servicio-form-modal',
  templateUrl: './servicio-form-modal.component.html'
})
export class ServicioFormModalComponent implements OnInit {

  @Input() servicioId: number | null = null;
  @Input() equipoIdInicial: number | null = null;

  form: FormGroup;
  cargando = false;
  guardando = false;
  errorGeneral: string | null = null;

  equipos: EquipoResumenResponse[] = [];
  tecnicos: UsuarioResumenResponse[] = [];

  repuestoFilas: FilaRepuesto[] = [];
  checklistFilas: FilaChecklist[] = [];

  tipoLabel = TIPO_SERVICIO_LABEL;
  tipos: TipoServicio[] = ['ALISTAMIENTO', 'PREVENTIVO', 'CORRECTIVO'];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private equipoService: EquipoService,
    private usuarioService: UsuarioService,
    private checklistItemService: ChecklistItemService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      equipoId: [null, Validators.required],
      tipoServicio: ['CORRECTIVO', Validators.required],
      descripcion: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      costoValorizado: [0, [Validators.required, Validators.min(0)]],
      tecnicoResponsableId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargando = true;

    forkJoin({
      equipos: this.equipoService.listarTodos(),
      tecnicos: this.usuarioService.listar()
    }).subscribe(({ equipos, tecnicos }) => {
      this.equipos = equipos.content;
      this.tecnicos = tecnicos;

      if (this.servicioId) {
        this.cargarServicioExistente(this.servicioId);
      } else {
        this.cargando = false;
      }
    });

    if (this.equipoIdInicial) {
      this.form.patchValue({ equipoId: this.equipoIdInicial });
    }
  }

  private cargarServicioExistente(id: number): void {
    this.servicioService.obtener(id).subscribe({
      next: servicio => {
        this.form.patchValue({
          equipoId: servicio.equipo.id,
          tipoServicio: servicio.tipoServicio,
          descripcion: servicio.descripcion,
          fecha: servicio.fecha,
          costoValorizado: servicio.costoValorizado,
          tecnicoResponsableId: servicio.tecnicoResponsable?.id ?? null
        });
        this.repuestoFilas = servicio.repuestos.map(r => ({
          id: r.id,
          nombre: r.nombre,
          cantidad: r.cantidad,
          costoUnitario: r.costoUnitario
        }));
        this.cargarChecklist(servicio.equipo.categoria.id, servicio.checklist);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar el servicio.');
        this.activeModal.dismiss();
      }
    });
  }

  get esEdicion(): boolean {
    return this.servicioId !== null;
  }

  get equipoSeleccionado(): EquipoResumenResponse | undefined {
    return this.equipos.find(e => e.id === this.form.get('equipoId')?.value);
  }

  onEquipoChange(): void {
    const equipo = this.equipoSeleccionado;
    if (equipo) {
      this.cargarChecklist(equipo.categoria.id, []);
    } else {
      this.checklistFilas = [];
    }
  }

  private cargarChecklist(categoriaId: number, respuestasExistentes: ServicioChecklistRespuestaResponse[]): void {
    this.checklistItemService.listar(categoriaId).subscribe(items => {
      this.checklistFilas = items
        .filter(item => item.activo)
        .map(item => {
          const existente = respuestasExistentes.find(r => r.itemId === item.id);
          return {
            itemId: item.id,
            nombre: item.nombre,
            completado: existente?.completado ?? false,
            observacion: existente?.observacion ?? ''
          };
        });
    });
  }

  agregarRepuesto(): void {
    this.repuestoFilas.push({ id: null, nombre: '', cantidad: 1, costoUnitario: 0 });
  }

  quitarRepuesto(index: number): void {
    this.repuestoFilas.splice(index, 1);
  }

  subtotalRepuesto(fila: FilaRepuesto): number {
    return (fila.cantidad || 0) * (fila.costoUnitario || 0);
  }

  get totalRepuestos(): number {
    return this.repuestoFilas.reduce((total, f) => total + this.subtotalRepuesto(f), 0);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const filaInvalida = this.repuestoFilas.some(
      f => !f.nombre || !f.nombre.trim() || f.cantidad <= 0 || f.costoUnitario < 0
    );
    if (filaInvalida) {
      this.toastr.error('Revisa las filas de repuestos: falta el nombre, la cantidad o el costo es inválido.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;

    const request: ServicioRequest = {
      ...this.form.value,
      repuestos: this.repuestoFilas.map(f => ({
        id: f.id ?? null,
        nombre: f.nombre.trim(),
        cantidad: f.cantidad,
        costoUnitario: f.costoUnitario
      })),
      checklist: this.checklistFilas.map(c => ({
        itemId: c.itemId,
        completado: c.completado,
        observacion: c.observacion || null
      }))
    };

    const esCreacion = !this.esEdicion;
    const accion$ = this.esEdicion
      ? this.servicioService.actualizar(this.servicioId!, request)
      : this.servicioService.crear(request);

    accion$.subscribe({
      next: servicio => {
        this.guardando = false;
        this.activeModal.close(servicio);
        if (esCreacion) {
          this.descargarPdfAlCrear(servicio.id, servicio.numero);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el servicio.';
      }
    });
  }

  /** Al terminar de registrar un servicio nuevo, descarga de una vez el PDF con el resultado del proceso. */
  private descargarPdfAlCrear(id: number, numero: string): void {
    this.servicioService.descargarPdf(id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `${numero}.pdf`;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('El servicio se guardó, pero no se pudo generar el PDF.')
    });
  }
}
