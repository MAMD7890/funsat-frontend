import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  Rol,
  UsuarioResponse
} from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {
  }

  login(request: LoginRequest, mantenerSesion: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(res => this.tokenStorage.guardarSesion(res.accessToken, res.refreshToken, res.usuario, mantenerSesion))
    );
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.tokenStorage.obtenerRefreshToken();
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
      tap(res => this.tokenStorage.actualizarAccessToken(res.accessToken))
    );
  }

  registrar(request: RegisterRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.baseUrl}/register`, request);
  }

  cambiarPassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/change-password`, request).pipe(
      tap(() => {
        const usuario = this.tokenStorage.obtenerUsuario();
        if (usuario) {
          usuario.debeCambiarPassword = false;
          this.tokenStorage.actualizarUsuario(usuario);
        }
      })
    );
  }

  actualizarUsuarioLocal(usuario: UsuarioResponse): void {
    this.tokenStorage.actualizarUsuario(usuario);
  }

  logout(): void {
    this.tokenStorage.limpiarSesion();
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.obtenerAccessToken();
  }

  usuarioActual(): UsuarioResponse | null {
    return this.tokenStorage.obtenerUsuario();
  }

  tieneRol(...roles: Rol[]): boolean {
    const rol = this.tokenStorage.obtenerRol();
    return rol !== null && roles.includes(rol);
  }
}
