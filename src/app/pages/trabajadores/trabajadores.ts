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
  successMessage = '';
  guardando = false;
  mostrarFormulario = false;

  nuevoTrabajador = {
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    cargo: '',
    area: '',
    sueldoBase: 0,
    fechaIngreso: '',
    telefono: '',
    email: '',
    direccion: '',
    tipoContrato: 'INDETERMINADO',
    regimenLaboral: 'GENERAL',
    empresaId: Number(localStorage.getItem('empresaId'))
  };

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
      const documento = trabajador.numeroDocumento?.toLowerCase() || '';
      const cargo = trabajador.cargo?.toLowerCase() || '';
      const area = trabajador.area?.toLowerCase() || '';

      const coincideBusqueda =
        nombreCompleto.includes(texto) ||
        documento.includes(texto) ||
        cargo.includes(texto) ||
        area.includes(texto);

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

  abrirFormulario(): void {
    this.mostrarFormulario = true;
  }

  limpiarFormulario(): void {
    this.nuevoTrabajador = {
      nombres: '',
      apellidos: '',
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      cargo: '',
      area: '',
      sueldoBase: 0,
      fechaIngreso: '',
      telefono: '',
      email: '',
      direccion: '',
      tipoContrato: 'INDETERMINADO',
      regimenLaboral: 'GENERAL',
      empresaId: Number(localStorage.getItem('empresaId'))
    };
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.limpiarFormulario();

    this.nuevoTrabajador = {
      nombres: '',
      apellidos: '',
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      cargo: '',
      area: '',
      sueldoBase: 0,
      fechaIngreso: '',
      telefono: '',
      email: '',
      direccion: '',
      tipoContrato: 'INDETERMINADO',
      regimenLaboral: 'GENERAL',
      empresaId: Number(localStorage.getItem('empresaId'))
    };
  }

  formatearTextoNombre(texto: string): string {
    return texto
      .toLowerCase()
      .trim()
      .split(' ')
      .filter(palabra => palabra.length > 0)
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  guardarTrabajador(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.nuevoTrabajador.nombres ||
      !this.nuevoTrabajador.apellidos ||
      !this.nuevoTrabajador.numeroDocumento ||
      !this.nuevoTrabajador.cargo ||
      !this.nuevoTrabajador.sueldoBase ||
      !this.nuevoTrabajador.fechaIngreso
    ) {
      this.errorMessage = 'Complete los campos obligatorios del trabajador';
      return;
    }

    if (
      this.nuevoTrabajador.tipoDocumento === 'DNI' &&
      !/^\d{8}$/.test(this.nuevoTrabajador.numeroDocumento)
    ) {
      this.errorMessage = 'El DNI debe tener exactamente 8 dígitos';
      return;
    }

    if (
      this.nuevoTrabajador.tipoDocumento === 'CE' &&
      !/^[A-Za-z0-9]{9,12}$/.test(this.nuevoTrabajador.numeroDocumento)
    ) {
      this.errorMessage = 'El carnet de extranjería debe tener entre 9 y 12 caracteres';
      return;
    }

    this.nuevoTrabajador.nombres = this.formatearTextoNombre(this.nuevoTrabajador.nombres);
    this.nuevoTrabajador.apellidos = this.formatearTextoNombre(this.nuevoTrabajador.apellidos);
    this.nuevoTrabajador.cargo = this.formatearTextoNombre(this.nuevoTrabajador.cargo);
    this.nuevoTrabajador.area = this.formatearTextoNombre(this.nuevoTrabajador.area);

    this.guardando = true;

    this.trabajadorService.crearTrabajador(this.nuevoTrabajador).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.limpiarFormulario();

        this.trabajadorService.obtenerTrabajadoresEmpresaActual().subscribe({
          next: (data) => {
            this.trabajadores = data;
            this.aplicarFiltros();
            this.successMessage = 'Trabajador registrado correctamente';
            this.guardando = false;

            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (error) => {
            console.log('ERROR RECARGAR TRABAJADORES:', error);
            this.errorMessage = 'El trabajador se registró, pero no se pudo actualizar la tabla';
            this.guardando = false;
          }
        });
      },
      error: (error) => {
        console.log('ERROR CREAR TRABAJADOR:', error);
        console.log('MENSAJE BACKEND:', error.error);

        this.errorMessage = error.error?.message || 'No se pudo registrar el trabajador';
        this.guardando = false;
      }
    });
  }

  formatearMoneda(valor: number): string {
    return `S/ ${(valor || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }
}