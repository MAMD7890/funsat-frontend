import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { limpiarBlancos } from '../../core/utils/form.utils';
import { RepuestoResponse } from '../repuesto.models';
import { RepuestoService } from '../repuesto.service';

@Component({
  selector: 'app-repuesto-form-modal',
  templateUrl: './repuesto-form-modal.component.html'
})
export class RepuestoFormModalComponent implements OnInit {

  @Input() repuesto: RepuestoResponse | null = null;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private repuestoService: RepuestoService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(160)]],
      codigo: [''],
      costoUnitario: [0, [Validators.required, Validators.min(0)]],
      stockDisponible: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.repuesto) {
      this.form.patchValue(this.repuesto);
    }
  }

  get esEdicion(): boolean {
    return !!this.repuesto;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Revisa los campos marcados en rojo.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;
    const request = limpiarBlancos(this.form.value);

    const accion$ = this.esEdicion
      ? this.repuestoService.actualizar(this.repuesto!.id, request)
      : this.repuestoService.crear(request);

    accion$.subscribe({
      next: repuesto => {
        this.guardando = false;
        this.activeModal.close(repuesto);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el repuesto.';
      }
    });
  }
}
