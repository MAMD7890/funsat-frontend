import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../core/models/page.model';
import { RepuestoRequest, RepuestoResponse } from './repuesto.models';

@Injectable({ providedIn: 'root' })
export class RepuestoService {

  private readonly baseUrl = `${environment.apiBaseUrl}/repuestos`;

  constructor(private http: HttpClient) {
  }

  listar(pagina = 0, tamano = 20): Observable<PageResponse<RepuestoResponse>> {
    const params = new HttpParams().set('page', pagina).set('size', tamano).set('sort', 'nombre');
    return this.http.get<PageResponse<RepuestoResponse>>(this.baseUrl, { params });
  }

  listarTodos(): Observable<PageResponse<RepuestoResponse>> {
    const params = new HttpParams().set('page', 0).set('size', 200).set('sort', 'nombre');
    return this.http.get<PageResponse<RepuestoResponse>>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<RepuestoResponse> {
    return this.http.get<RepuestoResponse>(`${this.baseUrl}/${id}`);
  }

  crear(request: RepuestoRequest): Observable<RepuestoResponse> {
    return this.http.post<RepuestoResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: RepuestoRequest): Observable<RepuestoResponse> {
    return this.http.put<RepuestoResponse>(`${this.baseUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
