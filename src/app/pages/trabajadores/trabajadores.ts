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
  modoFormulario: 'CREAR' | 'EDITAR' | 'VER' = 'CREAR';
  trabajadorSeleccionadoId: number | null = null;

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
    this.modoFormulario = 'CREAR';
    this.trabajadorSeleccionadoId = null;
    this.limpiarFormulario();
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

  verTrabajador(trabajador: Trabajador): void {
    this.modoFormulario = 'VER';
    this.trabajadorSeleccionadoId = trabajador.id;

    this.nuevoTrabajador = {
      nombres: trabajador.nombres,
      apellidos: trabajador.apellidos,
      tipoDocumento: trabajador.tipoDocumento,
      numeroDocumento: trabajador.numeroDocumento,
      cargo: trabajador.cargo,
      area: trabajador.area,
      sueldoBase: trabajador.sueldoBase,
      fechaIngreso: trabajador.fechaIngreso,
      telefono: trabajador.telefono,
      email: trabajador.email,
      direccion: trabajador.direccion,
      tipoContrato: trabajador.tipoContrato,
      regimenLaboral: trabajador.regimenLaboral,
      empresaId: Number(localStorage.getItem('empresaId'))
    };

    this.mostrarFormulario = true;
  }

  editarTrabajador(trabajador: Trabajador): void {
    this.modoFormulario = 'EDITAR';
    this.trabajadorSeleccionadoId = trabajador.id;

    this.nuevoTrabajador = {
      nombres: trabajador.nombres,
      apellidos: trabajador.apellidos,
      tipoDocumento: trabajador.tipoDocumento,
      numeroDocumento: trabajador.numeroDocumento,
      cargo: trabajador.cargo,
      area: trabajador.area,
      sueldoBase: trabajador.sueldoBase,
      fechaIngreso: trabajador.fechaIngreso,
      telefono: trabajador.telefono,
      email: trabajador.email,
      direccion: trabajador.direccion,
      tipoContrato: trabajador.tipoContrato,
      regimenLaboral: trabajador.regimenLaboral,
      empresaId: Number(localStorage.getItem('empresaId'))
    };

    this.mostrarFormulario = true;
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

    if (this.modoFormulario === 'EDITAR' && this.trabajadorSeleccionadoId) {
      this.actualizarTrabajador();
    } else {
      this.crearTrabajador();
    }
  }

  crearTrabajador(): void {
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

  actualizarTrabajador(): void {
    if (!this.trabajadorSeleccionadoId) {
      this.errorMessage = 'No se encontró el trabajador seleccionado';
      this.guardando = false;
      return;
    }

    this.trabajadorService.actualizarTrabajador(
      this.trabajadorSeleccionadoId,
      this.nuevoTrabajador
    ).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.limpiarFormulario();

        this.trabajadorService.obtenerTrabajadoresEmpresaActual().subscribe({
          next: (data) => {
            this.trabajadores = data;
            this.aplicarFiltros();
            this.successMessage = 'Trabajador actualizado correctamente';
            this.guardando = false;

            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (error) => {
            console.log('ERROR RECARGAR TRABAJADORES:', error);
            this.errorMessage = 'El trabajador se actualizó, pero no se pudo actualizar la tabla';
            this.guardando = false;
          }
        });
      },
      error: (error) => {
        console.log('ERROR ACTUALIZAR TRABAJADOR:', error);
        console.log('MENSAJE BACKEND:', error.error);

        this.errorMessage = error.error?.message || 'No se pudo actualizar el trabajador';
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

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return '-';

    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  obtenerClaseEstado(estado: string | null | undefined): string {
    if (!estado) return 'status-badge';

    return estado === 'ACTIVO'
      ? 'status-badge active'
      : 'status-badge inactive';
  }
}