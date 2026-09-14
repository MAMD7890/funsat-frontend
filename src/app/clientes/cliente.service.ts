import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../core/models/page.model';
import { ClienteRequest, ClienteResponse } from './cliente.models';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private readonly baseUrl = `${environment.apiBaseUrl}/clientes`;

  constructor(private http: HttpClient) {
  }

  listar(pagina = 0, tamano = 20, q: string | null = null): Observable<PageResponse<ClienteResponse>> {
    let params = new HttpParams().set('page', pagina).set('size', tamano).set('sort', 'nombre');
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<ClienteResponse>>(this.baseUrl, { params });
  }

  /** Trae hasta 200 clientes de una sola vez, para poblar el selector del formulario de Equipo. */
  listarTodos(): Observable<PageResponse<ClienteResponse>> {
    const params = new HttpParams().set('page', 0).set('size', 200).set('sort', 'nombre');
    return this.http.get<PageResponse<ClienteResponse>>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.baseUrl}/${id}`);
  }

  crear(request: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: ClienteRequest): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.baseUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
