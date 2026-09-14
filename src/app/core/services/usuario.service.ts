import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rol } from '../models/auth.models';
import { UsuarioResumenResponse } from '../models/usuario-resumen.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly baseUrl = `${environment.apiBaseUrl}/usuarios`;

  constructor(private http: HttpClient) {
  }

  listar(rol?: Rol | null): Observable<UsuarioResumenResponse[]> {
    let params = new HttpParams();
    if (rol) {
      params = params.set('rol', rol);
    }
    return this.http.get<UsuarioResumenResponse[]>(this.baseUrl, { params });
  }
}
