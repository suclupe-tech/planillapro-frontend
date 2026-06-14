import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trabajador {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  cargo: string;
  sueldoBasico: number;
  fechaIngreso: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = 'http://localhost:8080/api/trabajadores';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerTrabajadoresEmpresaActual(): Observable<Trabajador[]> {
    const empresaId = localStorage.getItem('empresaId');

    return this.http.get<Trabajador[]>(`${this.apiUrl}/empresa/${empresaId}`, {
      headers: this.getHeaders()
    });
  }
}