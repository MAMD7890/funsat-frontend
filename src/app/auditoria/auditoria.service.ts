import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../core/models/page.model';
import { AuditoriaResponse } from './auditoria.models';

export interface FiltrosAuditoria {
  usuario?: string | null;
  entidad?: string | null;
  desde?: string | null;
  hasta?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuditoriaService {

  private readonly baseUrl = `${environment.apiBaseUrl}/auditoria`;

  constructor(private http: HttpClient) {
  }

  listar(pagina: number, filtros: FiltrosAuditoria): Observable<PageResponse<AuditoriaResponse>> {
    let params = new HttpParams().set('page', pagina).set('size', 25);
    if (filtros.usuario) {
      params = params.set('usuario', filtros.usuario);
    }
    if (filtros.entidad) {
      params = params.set('entidad', filtros.entidad);
    }
    if (filtros.desde) {
      params = params.set('desde', `${filtros.desde}T00:00:00`);
    }
    if (filtros.hasta) {
      params = params.set('hasta', `${filtros.hasta}T23:59:59`);
    }
    return this.http.get<PageResponse<AuditoriaResponse>>(this.baseUrl, { params });
  }
}
