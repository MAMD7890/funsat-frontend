import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../core/models/page.model';
import {
  OrdenSalidaRequest,
  OrdenSalidaResponse,
  RegistrarDevolucionRequest
} from './movimiento.models';

export interface FiltrosOrdenSalida {
  clienteId?: number | null;
  desde?: string | null;
  hasta?: string | null;
  q?: string | null;
}

@Injectable({ providedIn: 'root' })
export class MovimientoService {

  private readonly baseUrl = `${environment.apiBaseUrl}/ordenes-salida`;

  constructor(private http: HttpClient) {
  }

  listar(pagina: number, filtros: FiltrosOrdenSalida = {}, tamano = 10): Observable<PageResponse<OrdenSalidaResponse>> {
    let params = new HttpParams().set('page', pagina).set('size', tamano);

    if (filtros.clienteId) {
      params = params.set('clienteId', filtros.clienteId);
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

    return this.http.get<PageResponse<OrdenSalidaResponse>>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<OrdenSalidaResponse> {
    return this.http.get<OrdenSalidaResponse>(`${this.baseUrl}/${id}`);
  }

  equiposEnCalle(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/equipos-en-calle`);
  }

  crear(request: OrdenSalidaRequest): Observable<OrdenSalidaResponse> {
    return this.http.post<OrdenSalidaResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: OrdenSalidaRequest): Observable<OrdenSalidaResponse> {
    return this.http.put<OrdenSalidaResponse>(`${this.baseUrl}/${id}`, request);
  }

  registrarDevolucion(ordenId: number, itemId: number, request: RegistrarDevolucionRequest): Observable<OrdenSalidaResponse> {
    return this.http.put<OrdenSalidaResponse>(`${this.baseUrl}/${ordenId}/items/${itemId}/devolucion`, request);
  }

  registrarDevolucionAccesorio(ordenId: number, itemId: number, accesorioAsociacionId: number,
                                request: RegistrarDevolucionRequest): Observable<OrdenSalidaResponse> {
    return this.http.put<OrdenSalidaResponse>(
      `${this.baseUrl}/${ordenId}/items/${itemId}/accesorios/${accesorioAsociacionId}/devolucion`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  descargarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
