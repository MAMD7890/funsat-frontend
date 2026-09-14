import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rol } from '../core/models/auth.models';
import { ActualizarPermisosRequest, RolPermisosResponse } from './roles.models';

@Injectable({ providedIn: 'root' })
export class RolesService {

  private readonly baseUrl = `${environment.apiBaseUrl}/roles`;

  constructor(private http: HttpClient) {
  }

  listar(): Observable<RolPermisosResponse[]> {
    return this.http.get<RolPermisosResponse[]>(this.baseUrl);
  }

  actualizar(rol: Rol, request: ActualizarPermisosRequest): Observable<RolPermisosResponse> {
    return this.http.put<RolPermisosResponse>(`${this.baseUrl}/${rol}/permisos`, request);
  }
}
