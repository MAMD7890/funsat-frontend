import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { UsuarioResponse } from '../../core/models/auth.models';
import { ROL_LABEL } from '../../roles/roles.models';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-form-modal',
  templateUrl: './usuario-form-modal.component.html'
})
export class UsuarioFormModalComponent implements OnInit {

  @Input() usuario: UsuarioResponse | null = null;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;
  rolLabel = ROL_LABEL;
  roles: Array<'ADMIN' | 'SUPERVISOR' | 'TECNICO'> = ['ADMIN', 'SUPERVISOR', 'TECNICO'];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]{3,60}$/)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rol: ['TECNICO', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.usuario) {
      this.form.patchValue(this.usuario);
      this.form.get('username')?.disable();
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  get esEdicion(): boolean {
    return !!this.usuario;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Revisa los campos marcados en rojo.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;

    const accion$ = this.esEdicion
      ? this.usuarioService.editar(this.usuario!.id, {
          nombre: this.form.value.nombre,
          email: this.form.value.email || null,
          rol: this.form.value.rol
        })
      : this.usuarioService.crear(this.form.getRawValue());

    accion$.subscribe({
      next: usuario => {
        this.guardando = false;
        this.activeModal.close(usuario);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el usuario.';
      }
    });
  }
}
