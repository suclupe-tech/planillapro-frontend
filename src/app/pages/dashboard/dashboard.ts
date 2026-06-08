import { Component, OnInit } from '@angular/core';
import {
  DashboardService,
  DashboardResumen,
  UltimaPlanilla,
  TotalMensualPlanilla
} from '../../core/services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  resumen: DashboardResumen = {
    totalPlanillas: 0,
    planillasAbiertas: 0,
    planillasCerradas: 0,
    totalNetoPagar: 0
  };

  ultimasPlanillas: UltimaPlanilla[] = [];
  totalesMensuales: TotalMensualPlanilla[] = [];

  loading = true;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen = data;
      },
      error: (error) => {
        console.log('ERROR RESUMEN DASHBOARD:', error);
        this.errorMessage = 'No se pudo cargar el resumen del dashboard';
      }
    });

    this.dashboardService.obtenerUltimasPlanillas().subscribe({
      next: (data) => {
        this.ultimasPlanillas = data;
      },
      error: (error) => {
        console.log('ERROR ULTIMAS PLANILLAS:', error);
      }
    });

    this.dashboardService.obtenerTotalesMensuales().subscribe({
      next: (data) => {
        this.totalesMensuales = data;
        this.loading = false;
      },
      error: (error) => {
        console.log('ERROR TOTALES MENSUALES:', error);
        this.loading = false;
      }
    });
  }

  formatearMoneda(valor: number): string {
    return `S/ ${(valor || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  calcularAlturaBarra(valor: number): number {
    const maximo = this.obtenerMaximoMensual();

    if (!maximo || !valor) {
      return 4;
    }

    return (valor / maximo) * 100;
  }

  obtenerMaximoMensual(): number {
    if (!this.totalesMensuales || this.totalesMensuales.length === 0) {
      return 0;
    }

    return Math.max(
      ...this.totalesMensuales.map(item => item.totalNetoPagar || 0)
    );
  }

  obtenerMarcasEjeY(): number[] {
    const maximo = this.obtenerMaximoMensual();

    if (!maximo) {
      return [0];
    }

    const paso = Math.ceil(maximo / 4);

    return [
      paso * 4,
      paso * 3,
      paso * 2,
      paso,
      0
    ];
  }

  formatearNumeroSimple(valor: number): string {
    return new Intl.NumberFormat('es-PE', {
      maximumFractionDigits: 0
    }).format(valor);
  }

  obtenerMes(mes: number): string {
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr',
      'May', 'Jun', 'Jul', 'Ago',
      'Sep', 'Oct', 'Nov', 'Dic'
    ];

    return meses[mes - 1] || '';
  }
}