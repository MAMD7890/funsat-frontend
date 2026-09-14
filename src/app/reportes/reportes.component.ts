import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReporteResponse } from './reporte.models';
import { ReporteService } from './reporte.service';

const CHART_WIDTH = 600;
const CHART_HEIGHT = 160;
const CHART_PADDING = 10;

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {

  reporte: ReporteResponse | null = null;
  cargando = true;
  error = false;

  chartWidth = CHART_WIDTH;
  chartHeight = CHART_HEIGHT;

  constructor(private reporteService: ReporteService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.reporteService.generar().subscribe({
      next: reporte => {
        this.reporte = reporte;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error = true;
        this.toastr.error('No se pudo cargar el reporte.');
      }
    });
  }

  private get totales(): number[] {
    return this.reporte?.costosPorMes.map(c => c.total) ?? [];
  }

  private get maxTotal(): number {
    return Math.max(1, ...this.totales);
  }

  puntoX(indice: number): number {
    const cantidad = this.totales.length;
    if (cantidad <= 1) {
      return CHART_WIDTH / 2;
    }
    const usable = CHART_WIDTH - CHART_PADDING * 2;
    return CHART_PADDING + (usable * indice) / (cantidad - 1);
  }

  puntoY(valor: number): number {
    const usable = CHART_HEIGHT - CHART_PADDING * 2;
    return CHART_PADDING + usable * (1 - valor / this.maxTotal);
  }

  get puntosLinea(): string {
    return this.totales.map((valor, indice) => `${this.puntoX(indice)},${this.puntoY(valor)}`).join(' ');
  }

  get puntosArea(): string {
    if (this.totales.length === 0) {
      return '';
    }
    const base = CHART_HEIGHT - CHART_PADDING;
    const primero = `${this.puntoX(0)},${base}`;
    const ultimo = `${this.puntoX(this.totales.length - 1)},${base}`;
    return `${primero} ${this.puntosLinea} ${ultimo}`;
  }

  porcentajeBarra(valor: number, maximo: number): number {
    return maximo > 0 ? Math.round((valor / maximo) * 100) : 0;
  }

  get maxCantidadCorrectivos(): number {
    return Math.max(1, ...(this.reporte?.topEquiposCorrectivos.map(e => e.cantidad) ?? [0]));
  }

  get maxCantidadRepuestos(): number {
    return Math.max(1, ...(this.reporte?.topRepuestos.map(r => r.cantidadTotal) ?? [0]));
  }

  get maxCargaTecnico(): number {
    return Math.max(1, ...(this.reporte?.cargaPorTecnico.map(t => t.cantidadServicios) ?? [0]));
  }
}
