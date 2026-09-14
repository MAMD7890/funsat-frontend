import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../core/models/page.model';
import { EquipoRequest, EquipoResponse, EstadoEquipo, Propiedad } from './equipo.models';

export interface FiltrosEquipo {
  categoriaId?: number | null;
  estado?: EstadoEquipo | null;
  propiedad?: Propiedad | null;
  clienteId?: number | null;
  q?: string | null;
}

@Injectable({ providedIn: 'root' })
export class EquipoService {

  private readonly baseUrl = `${environment.apiBaseUrl}/equipos`;

  constructor(private http: HttpClient) {
  }

  listar(pagina: number, filtros: FiltrosEquipo = {}, tamano = 10): Observable<PageResponse<EquipoResponse>> {
    let params = new HttpParams().set('page', pagina).set('size', tamano);

    if (filtros.categoriaId) {
      params = params.set('categoriaId', filtros.categoriaId);
    }
    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }
    if (filtros.propiedad) {
      params = params.set('propiedad', filtros.propiedad);
    }
    if (filtros.clienteId) {
      params = params.set('clienteId', filtros.clienteId);
    }
    if (filtros.q) {
      params = params.set('q', filtros.q);
    }

    return this.http.get<PageResponse<EquipoResponse>>(this.baseUrl, { params });
  }

  /** Trae hasta 500 equipos de una sola vez, para poblar selectores (ej. formulario de Servicio). */
  listarTodos(): Observable<PageResponse<EquipoResponse>> {
    const params = new HttpParams().set('page', 0).set('size', 500).set('sort', 'descripcionEquipo');
    return this.http.get<PageResponse<EquipoResponse>>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<EquipoResponse> {
    return this.http.get<EquipoResponse>(`${this.baseUrl}/${id}`);
  }

  crear(request: EquipoRequest): Observable<EquipoResponse> {
    return this.http.post<EquipoResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: EquipoRequest): Observable<EquipoResponse> {
    return this.http.put<EquipoResponse>(`${this.baseUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
