import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResultadoAlertaResponse {
  enviado: boolean;
  mensaje: string;
  destinatarios: number;
}

@Injectable({ providedIn: 'root' })
export class AlertaService {

  private readonly baseUrl = `${environment.apiBaseUrl}/alertas`;

  constructor(private http: HttpClient) {
  }

  enviarResumen(): Observable<ResultadoAlertaResponse> {
    return this.http.post<ResultadoAlertaResponse>(`${this.baseUrl}/enviar-resumen`, {});
  }
}
