import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { EquipoResponse } from '../../equipos/equipo.models';
import { EquipoService } from '../../equipos/equipo.service';
import { limpiarBlancos } from '../../core/utils/form.utils';
import { RecordatorioResponse } from '../recordatorio.models';
import { RecordatorioService } from '../recordatorio.service';

@Component({
  selector: 'app-recordatorio-form-modal',
  templateUrl: './recordatorio-form-modal.component.html'
})
export class RecordatorioFormModalComponent implements OnInit {

  @Input() recordatorio: RecordatorioResponse | null = null;
  @Input() fechaInicial: string | null = null;
  @Input() equipoIdInicial: number | null = null;

  form: FormGroup;
  guardando = false;
  cargandoEquipos = false;
  errorGeneral: string | null = null;
  equipos: EquipoResponse[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private equipoService: EquipoService,
    private recordatorioService: RecordatorioService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      equipoId: [null, Validators.required],
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', Validators.maxLength(500)],
      fechaProgramada: ['', Validators.required],
      esRecurrente: [false],
      intervaloRecurrenciaDias: [30, [Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargandoEquipos = true;
    this.equipoService.listarTodos().subscribe({
      next: pagina => {
        this.equipos = pagina.content;
        this.cargandoEquipos = false;
      },
      error: () => {
        this.cargandoEquipos = false;
        this.toastr.error('No se pudo cargar la lista de equipos.');
      }
    });

    if (this.recordatorio) {
      this.form.patchValue({
        equipoId: this.recordatorio.equipoId,
        titulo: this.recordatorio.titulo,
        descripcion: this.recordatorio.descripcion,
        fechaProgramada: this.recordatorio.fechaProgramada,
        esRecurrente: this.recordatorio.intervaloRecurrenciaDias != null,
        intervaloRecurrenciaDias: this.recordatorio.intervaloRecurrenciaDias ?? 30
      });
      this.form.get('equipoId')?.disable();
    } else {
      if (this.fechaInicial) {
        this.form.patchValue({ fechaProgramada: this.fechaInicial });
      }
      if (this.equipoIdInicial) {
        this.form.patchValue({ equipoId: this.equipoIdInicial });
      }
    }
  }

  get esEdicion(): boolean {
    return !!this.recordatorio;
  }

  get equipoSeleccionado(): EquipoResponse | undefined {
    return this.equipos.find(e => e.id === this.form.get('equipoId')?.value);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Revisa los campos marcados en rojo.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;
    const valores = limpiarBlancos(this.form.getRawValue());
    const intervalo = valores.esRecurrente ? valores.intervaloRecurrenciaDias : null;

    const accion$ = this.esEdicion
      ? this.recordatorioService.editar(this.recordatorio!.id, {
        titulo: valores.titulo,
        descripcion: valores.descripcion,
        fechaProgramada: valores.fechaProgramada,
        intervaloRecurrenciaDias: intervalo
      })
      : this.recordatorioService.crear({
        equipoId: valores.equipoId,
        titulo: valores.titulo,
        descripcion: valores.descripcion,
        fechaProgramada: valores.fechaProgramada,
        intervaloRecurrenciaDias: intervalo
      });

    accion$.subscribe({
      next: recordatorio => {
        this.guardando = false;
        this.activeModal.close(recordatorio);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el recordatorio.';
      }
    });
  }
}
