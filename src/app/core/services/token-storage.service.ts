import { Injectable } from '@angular/core';
import { Rol, UsuarioResponse } from '../models/auth.models';

const ACCESS_TOKEN_KEY = 'inv_access_token';
const REFRESH_TOKEN_KEY = 'inv_refresh_token';
const USUARIO_KEY = 'inv_usuario';

/**
 * Envuelve localStorage/sessionStorage. Si el usuario marca "Mantener sesión
 * iniciada" en el login se usa localStorage (sobrevive a cerrar el navegador);
 * si no, sessionStorage (se borra al cerrar la pestaña).
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {

  private get storage(): Storage {
    return localStorage.getItem(ACCESS_TOKEN_KEY) !== null ? localStorage : sessionStorage;
  }

  guardarSesion(accessToken: string, refreshToken: string, usuario: UsuarioResponse, mantenerSesion: boolean): void {
    const storage = mantenerSesion ? localStorage : sessionStorage;
    const otro = mantenerSesion ? sessionStorage : localStorage;

    otro.removeItem(ACCESS_TOKEN_KEY);
    otro.removeItem(REFRESH_TOKEN_KEY);
    otro.removeItem(USUARIO_KEY);

    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    storage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  }

  actualizarAccessToken(accessToken: string): void {
    this.storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  obtenerAccessToken(): string | null {
    return this.storage.getItem(ACCESS_TOKEN_KEY);
  }

  obtenerRefreshToken(): string | null {
    return this.storage.getItem(REFRESH_TOKEN_KEY);
  }

  obtenerUsuario(): UsuarioResponse | null {
    const raw = this.storage.getItem(USUARIO_KEY);
    return raw ? JSON.parse(raw) as UsuarioResponse : null;
  }

  actualizarUsuario(usuario: UsuarioResponse): void {
    this.storage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  }

  obtenerRol(): Rol | null {
    return this.obtenerUsuario()?.rol ?? null;
  }

  limpiarSesion(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USUARIO_KEY);
  }
}
