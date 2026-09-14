import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CategoriaCatalogoRequest,
  CategoriaCatalogoResponse,
  TipoMotorCatalogoRequest,
  TipoMotorCatalogoResponse
} from './catalogo.models';

@Injectable({ providedIn: 'root' })
export class CategoriaCatalogoService {

  private readonly baseUrl = `${environment.apiBaseUrl}/categorias`;

  constructor(private http: HttpClient) {
  }

  listar(soloActivas = true): Observable<CategoriaCatalogoResponse[]> {
    return this.http.get<CategoriaCatalogoResponse[]>(this.baseUrl, { params: { soloActivas } });
  }

  crear(request: CategoriaCatalogoRequest): Observable<CategoriaCatalogoResponse> {
    return this.http.post<CategoriaCatalogoResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: CategoriaCatalogoRequest): Observable<CategoriaCatalogoResponse> {
    return this.http.put<CategoriaCatalogoResponse>(`${this.baseUrl}/${id}`, request);
  }
}

@Injectable({ providedIn: 'root' })
export class TipoMotorCatalogoService {

  private readonly baseUrl = `${environment.apiBaseUrl}/tipos-motor`;

  constructor(private http: HttpClient) {
  }

  listar(soloActivos = true): Observable<TipoMotorCatalogoResponse[]> {
    return this.http.get<TipoMotorCatalogoResponse[]>(this.baseUrl, { params: { soloActivos } });
  }

  crear(request: TipoMotorCatalogoRequest): Observable<TipoMotorCatalogoResponse> {
    return this.http.post<TipoMotorCatalogoResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: TipoMotorCatalogoRequest): Observable<TipoMotorCatalogoResponse> {
    return this.http.put<TipoMotorCatalogoResponse>(`${this.baseUrl}/${id}`, request);
  }
}
