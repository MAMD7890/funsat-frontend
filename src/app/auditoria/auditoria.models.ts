export type AccionAuditoria = 'CREAR' | 'EDITAR' | 'ELIMINAR';

export interface AuditoriaResponse {
  id: number;
  usuarioUsername: string | null;
  usuarioNombre: string | null;
  accion: AccionAuditoria;
  entidad: string;
  entidadId: number | null;
  descripcion: string | null;
  fecha: string;
}

export const ACCION_AUDITORIA_LABEL: Record<AccionAuditoria, string> = {
  CREAR: 'Creación',
  EDITAR: 'Edición',
  ELIMINAR: 'Eliminación'
};

export const ACCION_AUDITORIA_BADGE: Record<AccionAuditoria, string> = {
  CREAR: 'badge-success',
  EDITAR: 'badge-info',
  ELIMINAR: 'badge-danger'
};

export const ACCION_AUDITORIA_ICONO: Record<AccionAuditoria, string> = {
  CREAR: 'fa-plus-circle',
  EDITAR: 'fa-pen',
  ELIMINAR: 'fa-trash'
};

export const ENTIDADES_AUDITABLES = ['Equipo', 'Cliente', 'Servicio', 'OrdenSalida', 'Usuario'];

export const ENTIDAD_AUDITORIA_LABEL: Record<string, string> = {
  Equipo: 'Equipo',
  Cliente: 'Cliente',
  Servicio: 'Servicio',
  OrdenSalida: 'Orden de salida',
  Usuario: 'Usuario'
};
