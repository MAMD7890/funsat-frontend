import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../core/models/page.model';
import { EstadoServicio, ServicioRequest, ServicioResponse, TipoServicio } from './servicio.models';

export interface FiltrosServicio {
  equipoId?: number | null;
  tipoServicio?: TipoServicio | null;
  tecnicoId?: number | null;
  estado?: EstadoServicio | null;
  desde?: string | null;
  hasta?: string | null;
  q?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ServicioService {

  private readonly baseUrl = `${environment.apiBaseUrl}/servicios`;

  constructor(private http: HttpClient) {
  }

  listar(pagina: number, filtros: FiltrosServicio = {}, tamano = 10): Observable<PageResponse<ServicioResponse>> {
    let params = new HttpParams().set('page', pagina).set('size', tamano);

    if (filtros.equipoId) {
      params = params.set('equipoId', filtros.equipoId);
    }
    if (filtros.tipoServicio) {
      params = params.set('tipoServicio', filtros.tipoServicio);
    }
    if (filtros.tecnicoId) {
      params = params.set('tecnicoId', filtros.tecnicoId);
    }
    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }
    if (filtros.desde) {
      params = params.set('desde', filtros.desde);
    }
    if (filtros.hasta) {
      params = params.set('hasta', filtros.hasta);
    }
    if (filtros.q) {
      params = params.set('q', filtros.q);
    }

    return this.http.get<PageResponse<ServicioResponse>>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<ServicioResponse> {
    return this.http.get<ServicioResponse>(`${this.baseUrl}/${id}`);
  }

  crear(request: ServicioRequest): Observable<ServicioResponse> {
    return this.http.post<ServicioResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: ServicioRequest): Observable<ServicioResponse> {
    return this.http.put<ServicioResponse>(`${this.baseUrl}/${id}`, request);
  }

  cambiarEstado(id: number, estado: EstadoServicio): Observable<ServicioResponse> {
    return this.http.put<ServicioResponse>(`${this.baseUrl}/${id}/estado`, { estado });
  }

  descargarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  /** Trae hasta 300 servicios de una sola vez, para el tablero Kanban. */
  listarTodosParaKanban(): Observable<PageResponse<ServicioResponse>> {
    const params = new HttpParams().set('page', 0).set('size', 300).set('sort', 'fecha,desc');
    return this.http.get<PageResponse<ServicioResponse>>(this.baseUrl, { params });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
