import { Rol } from '../core/models/auth.models';

export interface CrearUsuarioRequest {
  nombre: string;
  username: string;
  email?: string | null;
  password: string;
  rol: Rol;
}

export interface EditarUsuarioRequest {
  nombre: string;
  email?: string | null;
  rol: Rol;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface EditarPerfilRequest {
  nombre: string;
  email?: string | null;
}
