import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BusquedaGlobalService } from '../../core/services/busqueda-global.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { UsuarioResponse } from '../../core/models/auth.models';
import { ROL_ICONO, ROL_LABEL } from '../../roles/roles.models';
import { UsuarioFormModalComponent } from '../usuario-form-modal/usuario-form-modal.component';
import { UsuarioResetPasswordModalComponent } from '../usuario-reset-password-modal/usuario-reset-password-modal.component';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-listado',
  templateUrl: './usuario-listado.component.html'
})
export class UsuarioListadoComponent implements OnInit, OnDestroy {

  usuarios: UsuarioResponse[] = [];
  cargando = false;
  rolLabel = ROL_LABEL;
  rolIcono = ROL_ICONO;
  terminoBusqueda = '';

  private busquedaSub?: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService,
    private busquedaGlobal: BusquedaGlobalService
  ) {
  }

  ngOnInit(): void {
    this.cargar();
    this.busquedaSub = this.busquedaGlobal.termino$.subscribe(termino => {
      this.terminoBusqueda = termino;
    });
  }

  ngOnDestroy(): void {
    this.busquedaSub?.unsubscribe();
  }

  get usuariosFiltrados(): UsuarioResponse[] {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) {
      return this.usuarios;
    }
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino) || u.username.toLowerCase().includes(termino)
    );
  }

  get miUsername(): string | null {
    return this.authService.usuarioActual()?.username ?? null;
  }

  cargar(): void {
    this.cargando = true;
    this.usuarioService.listarTodos().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la lista de usuarios.');
      }
    });
  }

  nuevoUsuario(): void {
    const ref = this.modalService.open(UsuarioFormModalComponent, { centered: true });
    ref.result.then(
      () => {
        this.toastr.success('Usuario creado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  editarUsuario(usuario: UsuarioResponse): void {
    const ref = this.modalService.open(UsuarioFormModalComponent, { centered: true });
    ref.componentInstance.usuario = usuario;
    ref.result.then(
      () => {
        this.toastr.success('Usuario actualizado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  resetearPassword(usuario: UsuarioResponse): void {
    const ref = this.modalService.open(UsuarioResetPasswordModalComponent, { centered: true, size: 'sm' });
    ref.componentInstance.usuario = usuario;
    ref.result.then(
      () => this.toastr.success(`Contraseña de ${usuario.nombre} actualizada.`),
      () => undefined
    );
  }

  async cambiarEstado(usuario: UsuarioResponse): Promise<void> {
    if (usuario.activo) {
      const confirmado = await this.confirmService.confirmar(
        'Desactivar usuario',
        `¿Desactivar a "${usuario.nombre}"? No podrá iniciar sesión hasta que lo reactives.`,
        'Desactivar'
      );
      if (!confirmado) {
        return;
      }

      this.usuarioService.desactivar(usuario.id).subscribe({
        next: () => {
          this.toastr.success('Usuario desactivado.');
          this.cargar();
        },
        error: (err) => this.toastr.error(err?.error?.message ?? 'No se pudo desactivar el usuario.')
      });
    } else {
      this.usuarioService.activar(usuario.id).subscribe({
        next: () => {
          this.toastr.success('Usuario reactivado.');
          this.cargar();
        },
        error: (err) => this.toastr.error(err?.error?.message ?? 'No se pudo reactivar el usuario.')
      });
    }
  }
}
