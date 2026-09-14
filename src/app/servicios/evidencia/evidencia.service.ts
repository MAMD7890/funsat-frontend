import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EvidenciaFotograficaResponse, TipoEvidencia } from './evidencia.models';

@Injectable({ providedIn: 'root' })
export class EvidenciaService {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  listar(servicioId: number): Observable<EvidenciaFotograficaResponse[]> {
    return this.http.get<EvidenciaFotograficaResponse[]>(`${this.baseUrl}/servicios/${servicioId}/evidencias`);
  }

  subir(servicioId: number, archivo: File, tipoEvidencia: TipoEvidencia, descripcion: string | null): Observable<EvidenciaFotograficaResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('tipoEvidencia', tipoEvidencia);
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }
    return this.http.post<EvidenciaFotograficaResponse>(`${this.baseUrl}/servicios/${servicioId}/evidencias`, formData);
  }

  eliminar(servicioId: number, evidenciaId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/servicios/${servicioId}/evidencias/${evidenciaId}`);
  }

  /**
   * El endpoint de archivo requiere JWT (igual que el resto de la API), y un
   * <img src="..."> normal del navegador no manda el header Authorization.
   * Por eso se descarga como blob vía HttpClient (que sí pasa por el
   * interceptor) y se arma un object URL para el <img>.
   */
  descargarBlob(servicioId: number, evidenciaId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/servicios/${servicioId}/evidencias/${evidenciaId}/archivo`, {
      responseType: 'blob'
    });
  }
}
