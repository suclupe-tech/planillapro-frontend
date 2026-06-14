import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trabajador {
  id: number;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  cargo: string;
  area: string;
  sueldoBase: number;
  fechaIngreso: string;
  estado: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoContrato: string;
  regimenLaboral: string;
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

  crearTrabajador(request: any): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.apiUrl, request, {
      headers: this.getHeaders()
    });
  }

  buscarPorId(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  actualizarTrabajador(id: number, request: any): Observable<Trabajador> {
    return this.http.put<Trabajador>(`${this.apiUrl}/${id}`, request, {
      headers: this.getHeaders()
    });
  }

  darDeBaja(id: number, fechaCese: string): Observable<Trabajador> {
    return this.http.patch<Trabajador>(
      `${this.apiUrl}/${id}/baja?fechaCese=${fechaCese}`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }

  reactivar(id: number): Observable<Trabajador> {
    return this.http.patch<Trabajador>(
      `${this.apiUrl}/${id}/reactivar`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }
}