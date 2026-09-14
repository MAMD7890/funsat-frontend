import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CrearRecordatorioRequest,
  EditarRecordatorioRequest,
  NotificacionesRecordatorioResponse,
  RecordatorioResponse
} from './recordatorio.models';

@Injectable({ providedIn: 'root' })
export class RecordatorioService {

  private readonly baseUrl = `${environment.apiBaseUrl}/recordatorios`;

  constructor(private http: HttpClient) {
  }

  listarPorRango(desde: string, hasta: string): Observable<RecordatorioResponse[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<RecordatorioResponse[]>(this.baseUrl, { params });
  }

  notificaciones(): Observable<NotificacionesRecordatorioResponse> {
    return this.http.get<NotificacionesRecordatorioResponse>(`${this.baseUrl}/notificaciones`);
  }

  crear(request: CrearRecordatorioRequest): Observable<RecordatorioResponse> {
    return this.http.post<RecordatorioResponse>(this.baseUrl, request);
  }

  editar(id: number, request: EditarRecordatorioRequest): Observable<RecordatorioResponse> {
    return this.http.put<RecordatorioResponse>(`${this.baseUrl}/${id}`, request);
  }

  completar(id: number): Observable<RecordatorioResponse> {
    return this.http.put<RecordatorioResponse>(`${this.baseUrl}/${id}/completar`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
