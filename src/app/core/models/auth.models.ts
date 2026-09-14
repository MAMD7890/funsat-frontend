export type Rol = 'ADMIN' | 'SUPERVISOR' | 'TECNICO';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RegisterRequest {
  nombre: string;
  username: string;
  password: string;
  rol: Rol;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  username: string;
  email: string | null;
  rol: Rol;
  activo: boolean;
  debeCambiarPassword: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  usuario: UsuarioResponse;
}
