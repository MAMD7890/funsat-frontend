import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ImportResultResponse } from './importacion.models';

@Injectable({ providedIn: 'root' })
export class ImportacionService {

  private readonly baseUrl = `${environment.apiBaseUrl}/importacion`;

  constructor(private http: HttpClient) {
  }

  importarMaster(archivo: File): Observable<ImportResultResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<ImportResultResponse>(`${this.baseUrl}/equipos-master`, formData);
  }

  importarTaller(archivo: File): Observable<ImportResultResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<ImportResultResponse>(`${this.baseUrl}/equipos-taller`, formData);
  }

  descargarPlantillaMaster(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/plantilla/master`, { responseType: 'blob' });
  }

  descargarPlantillaTaller(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/plantilla/taller`, { responseType: 'blob' });
  }
}
