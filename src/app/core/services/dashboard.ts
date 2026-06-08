import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardResumen {
  totalPlanillas: number;
  planillasAbiertas: number;
  planillasCerradas: number;
  totalNetoPagar: number;
}

export interface UltimaPlanilla {
  id: number;
  nombre: string;
  tipo: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface TotalMensualPlanilla {
  anio: number;
  mes: number;
  nombreMes: string;
  totalIngresos: number;
  totalDescuentos: number;
  totalNetoPagar: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard/planillas';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  obtenerUltimasPlanillas(): Observable<UltimaPlanilla[]> {
    return this.http.get<UltimaPlanilla[]>(`${this.apiUrl}/ultimas`, {
      headers: this.getHeaders()
    });
  }

  obtenerTotalesMensuales(): Observable<TotalMensualPlanilla[]> {
    return this.http.get<TotalMensualPlanilla[]>(`${this.apiUrl}/totales-mensuales`, {
      headers: this.getHeaders()
    });
  }
}