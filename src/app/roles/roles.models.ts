import { Rol } from '../core/models/auth.models';

export type ModuloPermiso = 'EQUIPOS' | 'CLIENTES' | 'SERVICIOS' | 'REPUESTOS' | 'CHECKLIST' | 'USUARIOS' | 'RECORDATORIOS' | 'MOVIMIENTOS';
export type AccionPermiso = 'VER' | 'CREAR' | 'EDITAR' | 'ELIMINAR';

export const MODULO_LABEL: Record<ModuloPermiso, string> = {
  EQUIPOS: 'Equipos',
  CLIENTES: 'Clientes',
  SERVICIOS: 'Servicios / Mantenimientos',
  REPUESTOS: 'Repuestos',
  CHECKLIST: 'Checklist',
  USUARIOS: 'Usuarios',
  RECORDATORIOS: 'Recordatorios de Mantenimiento',
  MOVIMIENTOS: 'Movimientos de Equipos'
};

export const ROL_LABEL: Record<Rol, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  TECNICO: 'Técnico'
};

export const ROL_ICONO: Record<Rol, string> = {
  ADMIN: 'fa-user-shield',
  SUPERVISOR: 'fa-user-tie',
  TECNICO: 'fa-user-cog'
};

export interface PermisoResponse {
  modulo: ModuloPermiso;
  accion: AccionPermiso;
  permitido: boolean;
}

export interface RolPermisosResponse {
  rol: Rol;
  usuariosActivos: number;
  permisos: PermisoResponse[];
}

export interface PermisoItemRequest {
  modulo: ModuloPermiso;
  accion: AccionPermiso;
  permitido: boolean;
}

export interface ActualizarPermisosRequest {
  permisos: PermisoItemRequest[];
}
