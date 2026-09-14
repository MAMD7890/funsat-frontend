import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../core/models/api-error.model';
import { Rol } from '../core/models/auth.models';
import {
  AccionPermiso,
  ActualizarPermisosRequest,
  MODULO_LABEL,
  ModuloPermiso,
  ROL_ICONO,
  ROL_LABEL,
  RolPermisosResponse
} from './roles.models';
import { RolesService } from './roles.service';

interface FilaMatriz {
  modulo: ModuloPermiso;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
}

/** Estos módulos/acciones ya existen en el catálogo pero todavía no hay
 *  ningún endpoint que los consulte (no hay editar/eliminar usuario todavía;
 *  crear usuario sigue hardcoded a ADMIN por riesgo de auto-escalación de
 *  privilegios). Se muestran deshabilitados para no fingir una función que
 *  no hace nada. */
const ACCIONES_SIN_EFECTO: { modulo: ModuloPermiso; accion: AccionPermiso }[] = [
  { modulo: 'USUARIOS', accion: 'CREAR' },
  { modulo: 'USUARIOS', accion: 'EDITAR' },
  { modulo: 'USUARIOS', accion: 'ELIMINAR' }
];

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {

  roles: RolPermisosResponse[] = [];
  rolSeleccionado: Rol | null = null;
  filas: FilaMatriz[] = [];
  cargando = false;
  guardando = false;
  modificado = false;

  rolLabel = ROL_LABEL;
  rolIcono = ROL_ICONO;
  moduloLabel = MODULO_LABEL;
  modulos: ModuloPermiso[] = ['EQUIPOS', 'CLIENTES', 'SERVICIOS', 'REPUESTOS', 'CHECKLIST', 'USUARIOS', 'RECORDATORIOS', 'MOVIMIENTOS'];

  constructor(private rolesService: RolesService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.cargar();
  }

  get rolActual(): RolPermisosResponse | undefined {
    return this.roles.find(r => r.rol === this.rolSeleccionado);
  }

  cargar(): void {
    this.cargando = true;
    this.rolesService.listar().subscribe({
      next: roles => {
        this.roles = roles;
        this.cargando = false;
        this.seleccionarRol(this.rolSeleccionado ?? roles[0]?.rol ?? null);
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar la matriz de roles y permisos.');
      }
    });
  }

  seleccionarRol(rol: Rol | null): void {
    this.rolSeleccionado = rol;
    this.modificado = false;
    const datos = this.roles.find(r => r.rol === rol);
    if (!datos) {
      this.filas = [];
      return;
    }

    this.filas = this.modulos.map(modulo => ({
      modulo,
      ver: this.buscarPermitido(datos, modulo, 'VER'),
      crear: this.buscarPermitido(datos, modulo, 'CREAR'),
      editar: this.buscarPermitido(datos, modulo, 'EDITAR'),
      eliminar: this.buscarPermitido(datos, modulo, 'ELIMINAR')
    }));
  }

  private buscarPermitido(datos: RolPermisosResponse, modulo: ModuloPermiso, accion: AccionPermiso): boolean {
    return datos.permisos.find(p => p.modulo === modulo && p.accion === accion)?.permitido ?? false;
  }

  sinEfecto(modulo: ModuloPermiso, accion: AccionPermiso): boolean {
    return ACCIONES_SIN_EFECTO.some(a => a.modulo === modulo && a.accion === accion);
  }

  marcarTodo(fila: FilaMatriz, valor: boolean): void {
    fila.ver = valor;
    fila.crear = valor;
    fila.editar = valor;
    fila.eliminar = this.sinEfecto(fila.modulo, 'ELIMINAR') ? fila.eliminar : valor;
    this.marcarModificado();
  }

  esFilaCompleta(fila: FilaMatriz): boolean {
    return fila.ver && fila.crear && fila.editar && fila.eliminar;
  }

  marcarModificado(): void {
    this.modificado = true;
  }

  guardar(): void {
    if (!this.rolSeleccionado) {
      return;
    }

    const permisos: ActualizarPermisosRequest['permisos'] = [];
    for (const fila of this.filas) {
      permisos.push({ modulo: fila.modulo, accion: 'VER', permitido: fila.ver });
      permisos.push({ modulo: fila.modulo, accion: 'CREAR', permitido: fila.crear });
      permisos.push({ modulo: fila.modulo, accion: 'EDITAR', permitido: fila.editar });
      permisos.push({ modulo: fila.modulo, accion: 'ELIMINAR', permitido: fila.eliminar });
    }
    const request: ActualizarPermisosRequest = { permisos };

    this.guardando = true;
    this.rolesService.actualizar(this.rolSeleccionado, request).subscribe({
      next: actualizado => {
        this.guardando = false;
        this.modificado = false;
        const idx = this.roles.findIndex(r => r.rol === actualizado.rol);
        if (idx >= 0) {
          this.roles[idx] = actualizado;
        }
        this.toastr.success(`Permisos de ${this.rolLabel[actualizado.rol]} actualizados.`);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.toastr.error(body?.message ?? 'No se pudieron guardar los permisos.');
      }
    });
  }
}
