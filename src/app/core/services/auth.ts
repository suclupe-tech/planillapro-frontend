import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  email: string;
  rol: string;
  empresaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  guardarSesion(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuarioId', response.usuarioId.toString());
    localStorage.setItem('email', response.email);
    localStorage.setItem('rol', response.rol);
    localStorage.setItem('empresaId', response.empresaId.toString());
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  cerrarSesion(): void {
    localStorage.clear();
  }
}