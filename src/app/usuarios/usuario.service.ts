import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioResponse } from '../core/models/auth.models';
import { CrearUsuarioRequest, EditarPerfilRequest, EditarUsuarioRequest, ResetPasswordRequest } from './usuario.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly baseUrl = `${environment.apiBaseUrl}/usuarios`;

  constructor(private http: HttpClient) {
  }

  listarTodos(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.baseUrl}/todos`);
  }

  crear(request: CrearUsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.baseUrl, request);
  }

  editar(id: number, request: EditarUsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.baseUrl}/${id}`, request);
  }

  activar(id: number): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.baseUrl}/${id}/activar`, {});
  }

  desactivar(id: number): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.baseUrl}/${id}/desactivar`, {});
  }

  resetearPassword(id: number, request: ResetPasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/resetear-password`, request);
  }

  actualizarPerfilPropio(request: EditarPerfilRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.baseUrl}/me`, request);
  }
}
