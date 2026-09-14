import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReporteResponse } from './reporte.models';

@Injectable({ providedIn: 'root' })
export class ReporteService {

  private readonly baseUrl = `${environment.apiBaseUrl}/reportes`;

  constructor(private http: HttpClient) {
  }

  generar(): Observable<ReporteResponse> {
    return this.http.get<ReporteResponse>(this.baseUrl);
  }
}
