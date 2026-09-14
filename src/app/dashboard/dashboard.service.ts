import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardResponse } from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly baseUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {
  }

  resumen(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/resumen`);
  }
}
