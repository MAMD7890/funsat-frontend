import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { BusquedaGlobalService } from '../../core/services/busqueda-global.service';
import { ThemeService } from '../../core/services/theme.service';
import { UsuarioResponse } from '../../core/models/auth.models';
import { RecordatorioResponse } from '../../recordatorios/recordatorio.models';
import { RecordatorioService } from '../../recordatorios/recordatorio.service';

interface ModuloBuscable {
  prefijo: string;
  placeholder: string;
}

/** Rutas donde el buscador de la barra superior aplica, y que le dice al usuario que va a filtrar. */
const MODULOS_BUSCABLES: ModuloBuscable[] = [
  { prefijo: '/equipos', placeholder: 'Buscar equipos por nombre o código...' },
  { prefijo: '/clientes', placeholder: 'Buscar clientes por nombre...' },
  { prefijo: '/servicios', placeholder: 'Buscar servicios por nombre o código de equipo...' },
  { prefijo: '/movimientos', placeholder: 'Buscar órdenes por cliente...' },
  { prefijo: '/usuarios', placeholder: 'Buscar usuarios por nombre...' }
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidebar = new EventEmitter<void>();

  vencidos: RecordatorioResponse[] = [];
  proximos: RecordatorioResponse[] = [];
  cargandoNotificaciones = false;

  mostrarBusqueda = false;
  placeholderBusqueda = 'Buscar...';
  terminoBusqueda = '';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private recordatorioService: RecordatorioService,
    private busquedaGlobal: BusquedaGlobalService
  ) {
    this.actualizarContextoBusqueda(this.router.url);
    this.router.events.pipe(filter(evento => evento instanceof NavigationStart)).subscribe(evento => {
      this.actualizarContextoBusqueda((evento as NavigationStart).url);
    });
  }

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  private actualizarContextoBusqueda(url: string): void {
    const modulo = MODULOS_BUSCABLES.find(m => url.startsWith(m.prefijo));
    this.mostrarBusqueda = !!modulo;
    this.placeholderBusqueda = modulo?.placeholder ?? 'Buscar...';
    this.terminoBusqueda = '';
    this.busquedaGlobal.limpiar();
  }

  onBuscarInput(valor: string): void {
    this.terminoBusqueda = valor;
    this.busquedaGlobal.escribir(valor);
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.busquedaGlobal.escribir('');
  }

  get totalNotificaciones(): number {
    return this.vencidos.length + this.proximos.length;
  }

  cargarNotificaciones(): void {
    this.cargandoNotificaciones = true;
    this.recordatorioService.notificaciones().subscribe({
      next: res => {
        this.vencidos = res.vencidos;
        this.proximos = res.proximos;
        this.cargandoNotificaciones = false;
      },
      error: () => {
        this.cargandoNotificaciones = false;
      }
    });
  }

  irAlCalendario(): void {
    this.router.navigate(['/apps/calendario']);
  }

  get usuario(): UsuarioResponse | null {
    return this.authService.usuarioActual();
  }

  get esOscuro(): boolean {
    return this.themeService.esOscuro();
  }

  alternarTema(): void {
    this.themeService.alternar();
  }

  iniciales(): string {
    const nombre = this.usuario?.nombre || this.usuario?.username || '?';
    return nombre.trim().charAt(0).toUpperCase();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
