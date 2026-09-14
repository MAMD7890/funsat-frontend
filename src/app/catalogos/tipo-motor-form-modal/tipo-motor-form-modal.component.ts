import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { TipoMotorCatalogoResponse } from '../catalogo.models';
import { TipoMotorCatalogoService } from '../catalogo.service';

@Component({
  selector: 'app-tipo-motor-form-modal',
  templateUrl: './tipo-motor-form-modal.component.html'
})
export class TipoMotorFormModalComponent implements OnInit {

  @Input() motor: TipoMotorCatalogoResponse | null = null;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private tipoMotorCatalogoService: TipoMotorCatalogoService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(80)]],
      orden: [0],
      activo: [true]
    });
  }

  ngOnInit(): void {
    if (this.motor) {
      this.form.patchValue(this.motor);
    }
  }

  get esEdicion(): boolean {
    return !!this.motor;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;
    const request = this.form.value;

    const accion$ = this.esEdicion
      ? this.tipoMotorCatalogoService.actualizar(this.motor!.id, request)
      : this.tipoMotorCatalogoService.crear(request);

    accion$.subscribe({
      next: motor => {
        this.guardando = false;
        this.activeModal.close(motor);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el tipo de motor.';
      }
    });
  }
}
