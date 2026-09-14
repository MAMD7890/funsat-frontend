import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DocumentoEquipoResponse, TipoDocumentoEquipo } from './documento-equipo.models';

@Injectable({ providedIn: 'root' })
export class DocumentoEquipoService {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  listar(equipoId: number): Observable<DocumentoEquipoResponse[]> {
    return this.http.get<DocumentoEquipoResponse[]>(`${this.baseUrl}/equipos/${equipoId}/documentos`);
  }

  subir(equipoId: number, archivo: File, tipoDocumento: TipoDocumentoEquipo, descripcion: string | null): Observable<DocumentoEquipoResponse> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('tipoDocumento', tipoDocumento);
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }
    return this.http.post<DocumentoEquipoResponse>(`${this.baseUrl}/equipos/${equipoId}/documentos`, formData);
  }

  eliminar(equipoId: number, documentoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/equipos/${equipoId}/documentos/${documentoId}`);
  }

  /** Igual que EvidenciaService: el endpoint requiere JWT, por eso se baja como blob vía HttpClient. */
  descargarBlob(equipoId: number, documentoId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/equipos/${equipoId}/documentos/${documentoId}/archivo`, {
      responseType: 'blob'
    });
  }
}
