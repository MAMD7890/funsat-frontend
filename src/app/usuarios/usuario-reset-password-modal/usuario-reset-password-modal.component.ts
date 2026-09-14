import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { UsuarioResponse } from '../../core/models/auth.models';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-reset-password-modal',
  templateUrl: './usuario-reset-password-modal.component.html'
})
export class UsuarioResetPasswordModalComponent {

  @Input() usuario!: UsuarioResponse;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Ingresa una contraseña de al menos 8 caracteres.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;
    this.usuarioService.resetearPassword(this.usuario.id, this.form.value).subscribe({
      next: () => {
        this.guardando = false;
        this.activeModal.close();
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo resetear la contraseña.';
      }
    });
  }
}
