import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  nombres = localStorage.getItem('nombres') || '';
  apellidos = localStorage.getItem('apellidos') || '';
  rolNombre = localStorage.getItem('rolNombre') || '';

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  get usuarioNombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`.trim() || 'Usuario';
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}