import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChecklistItemRequest, ChecklistItemResponse } from './checklist-item.models';

@Injectable({ providedIn: 'root' })
export class ChecklistItemService {

  private readonly baseUrl = `${environment.apiBaseUrl}/checklist-items`;

  constructor(private http: HttpClient) {
  }

  listar(categoriaId?: number | null): Observable<ChecklistItemResponse[]> {
    let params = new HttpParams();
    if (categoriaId) {
      params = params.set('categoriaId', categoriaId);
    }
    return this.http.get<ChecklistItemResponse[]>(this.baseUrl, { params });
  }

  crear(request: ChecklistItemRequest): Observable<ChecklistItemResponse> {
    return this.http.post<ChecklistItemResponse>(this.baseUrl, request);
  }

  actualizar(id: number, request: ChecklistItemRequest): Observable<ChecklistItemResponse> {
    return this.http.put<ChecklistItemResponse>(`${this.baseUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
