import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../core/models/api-error.model';
import { UsuarioResponse } from '../core/models/auth.models';
import { AuthService } from '../core/services/auth.service';
import { ROL_LABEL } from '../roles/roles.models';
import { UsuarioService } from '../usuarios/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  usuario: UsuarioResponse | null = null;
  form: FormGroup;
  guardando = false;
  rolLabel = ROL_LABEL;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual();
    if (this.usuario) {
      this.form.patchValue({ nombre: this.usuario.nombre, email: this.usuario.email });
    }
  }

  get iniciales(): string {
    const nombre = this.usuario?.nombre || this.usuario?.username || '?';
    return nombre.trim().charAt(0).toUpperCase();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('El nombre es obligatorio.');
      return;
    }

    this.guardando = true;
    this.usuarioService.actualizarPerfilPropio(this.form.value).subscribe({
      next: usuario => {
        this.guardando = false;
        this.usuario = usuario;
        this.authService.actualizarUsuarioLocal(usuario);
        this.toastr.success('Perfil actualizado correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.toastr.error(body?.message ?? 'No se pudo actualizar el perfil.');
      }
    });
  }
}
