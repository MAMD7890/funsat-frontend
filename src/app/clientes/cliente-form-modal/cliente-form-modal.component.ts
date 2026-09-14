import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { ClienteResponse } from '../cliente.models';
import { ClienteService } from '../cliente.service';
import { limpiarBlancos } from '../../core/utils/form.utils';

@Component({
  selector: 'app-cliente-form-modal',
  templateUrl: './cliente-form-modal.component.html'
})
export class ClienteFormModalComponent implements OnInit {

  @Input() cliente: ClienteResponse | null = null;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(160)]],
      tipo: ['NATURAL', Validators.required],
      telefono: [''],
      email: ['', Validators.email]
    });
  }

  ngOnInit(): void {
    if (this.cliente) {
      this.form.patchValue(this.cliente);
    }
  }

  get esEdicion(): boolean {
    return !!this.cliente;
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
      ? this.clienteService.actualizar(this.cliente!.id, request)
      : this.clienteService.crear(request);

    accion$.subscribe({
      next: cliente => {
        this.guardando = false;
        this.activeModal.close(cliente);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el cliente.';
      }
    });
  }
}
