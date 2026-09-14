import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/services/auth.service';
import { UsuarioResponse } from '../core/models/auth.models';
import { PROPIEDAD_LABEL, Propiedad } from '../equipos/equipo.models';
import { ESTADO_SERVICIO_LABEL, EstadoServicio, TIPO_SERVICIO_LABEL, TipoServicio } from '../servicios/servicio.models';
import { AlertaService } from './alerta.service';
import { DashboardResponse } from './dashboard.models';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  usuario: UsuarioResponse | null;
  ahora = new Date();
  private relojHandle?: ReturnType<typeof setInterval>;

  resumen: DashboardResponse | null = null;
  cargando = true;
  error = false;
  enviandoAlerta = false;

  tipoServicioLabel = TIPO_SERVICIO_LABEL;
  estadoServicioLabel = ESTADO_SERVICIO_LABEL;
  propiedadLabel = PROPIEDAD_LABEL;

  tiposServicio: TipoServicio[] = ['ALISTAMIENTO', 'PREVENTIVO', 'CORRECTIVO'];
  estadosServicio: EstadoServicio[] = ['REGISTRADO', 'EN_PROGRESO', 'EN_REVISION', 'COMPLETADO'];
  propiedades: Propiedad[] = ['PROPIO', 'EXTERNO'];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private alertaService: AlertaService,
    private toastr: ToastrService
  ) {
    this.usuario = this.authService.usuarioActual();
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  enviarResumenAlertas(): void {
    this.enviandoAlerta = true;
    this.alertaService.enviarResumen().subscribe({
      next: resultado => {
        this.enviandoAlerta = false;
        if (resultado.enviado) {
          this.toastr.success(`${resultado.mensaje} (${resultado.destinatarios} destinatario(s))`);
        } else {
          this.toastr.info(resultado.mensaje);
        }
      },
      error: () => {
        this.enviandoAlerta = false;
        this.toastr.error('No se pudo enviar el resumen de alertas.');
      }
    });
  }

  ngOnInit(): void {
    this.dashboardService.resumen().subscribe({
      next: resumen => {
        this.resumen = resumen;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error = true;
      }
    });

    this.relojHandle = setInterval(() => this.ahora = new Date(), 1000);
  }

  ngOnDestroy(): void {
    if (this.relojHandle) {
      clearInterval(this.relojHandle);
    }
  }

  porTipoServicio(tipo: TipoServicio): number {
    return this.resumen?.servicios.porTipo[tipo] ?? 0;
  }

  porEstadoServicio(estado: EstadoServicio): number {
    return this.resumen?.servicios.porEstado[estado] ?? 0;
  }

  porPropiedad(propiedad: Propiedad): number {
    return this.resumen?.equipos.porPropiedad[propiedad] ?? 0;
  }

  porcentaje(parte: number, total: number): number {
    return total > 0 ? Math.round((parte / total) * 100) : 0;
  }

  /** % de servicios de mantenimiento (preventivo+correctivo, sin contar alistamientos) que son preventivos. */
  get ratioPreventivo(): number | null {
    const preventivo = this.porTipoServicio('PREVENTIVO');
    const correctivo = this.porTipoServicio('CORRECTIVO');
    const total = preventivo + correctivo;
    return total > 0 ? this.porcentaje(preventivo, total) : null;
  }
}
