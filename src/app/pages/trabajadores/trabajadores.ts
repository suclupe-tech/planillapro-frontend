import { Component, OnInit } from '@angular/core';
import { Trabajador, TrabajadorService } from '../../core/services/trabajador';

@Component({
  selector: 'app-trabajadores',
  standalone: false,
  templateUrl: './trabajadores.html',
  styleUrl: './trabajadores.scss'
})
export class Trabajadores implements OnInit {
  trabajadores: Trabajador[] = [];
  trabajadoresFiltrados: Trabajador[] = [];

  terminoBusqueda = '';
  filtroEstado = 'TODOS';

  loading = true;
  errorMessage = '';

  constructor(private trabajadorService: TrabajadorService) { }

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  cargarTrabajadores(): void {
    this.loading = true;
    this.errorMessage = '';

    this.trabajadorService.obtenerTrabajadoresEmpresaActual().subscribe({
      next: (data) => {
        this.trabajadores = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.log('ERROR TRABAJADORES COMPLETO:', error);
        console.log('STATUS:', error.status);
        console.log('MENSAJE BACKEND:', error.error);

        this.errorMessage = 'No se pudo cargar la lista de trabajadores';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    const texto = this.terminoBusqueda.toLowerCase().trim();

    this.trabajadoresFiltrados = this.trabajadores.filter(trabajador => {
      const nombreCompleto = `${trabajador.nombres} ${trabajador.apellidos}`.toLowerCase();
      const dni = trabajador.dni?.toLowerCase() || '';
      const cargo = trabajador.cargo?.toLowerCase() || '';

      const coincideBusqueda =
        nombreCompleto.includes(texto) ||
        dni.includes(texto) ||
        cargo.includes(texto);

      const coincideEstado =
        this.filtroEstado === 'TODOS' ||
        trabajador.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }

  cambiarFiltroEstado(estado: string): void {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  formatearMoneda(valor: number): string {
    return `S/ ${(valor || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }
}