import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

interface ItemNav {
  etiqueta: string;
  icono: string;
  ruta?: string;
  disponible: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();

  itemsPrincipales: ItemNav[] = [
    { etiqueta: 'Dashboard', icono: 'fa-th-large', ruta: '/dashboard', disponible: true },
    { etiqueta: 'Equipos', icono: 'fa-toolbox', ruta: '/equipos', disponible: true },
    { etiqueta: 'Clientes', icono: 'fa-address-book', ruta: '/clientes', disponible: true },
    { etiqueta: 'Servicios / Mantenimientos', icono: 'fa-wrench', ruta: '/servicios', disponible: true },
    { etiqueta: 'Movimientos', icono: 'fa-truck', ruta: '/movimientos', disponible: true },
    { etiqueta: 'Calendario', icono: 'fa-calendar-alt', ruta: '/apps/calendario', disponible: true },
    { etiqueta: 'Kanban Board', icono: 'fa-columns', ruta: '/apps/kanban', disponible: true }
  ];

  itemsAdmin: ItemNav[] = [
    { etiqueta: 'Importar Excel', icono: 'fa-file-excel', ruta: '/importacion', disponible: true },
    { etiqueta: 'Usuarios', icono: 'fa-users', ruta: '/usuarios', disponible: true },
    { etiqueta: 'Roles y Permisos', icono: 'fa-user-shield', ruta: '/roles', disponible: true },
    { etiqueta: 'Auditoría', icono: 'fa-clipboard-list', ruta: '/auditoria', disponible: true },
    { etiqueta: 'Catálogos', icono: 'fa-tags', ruta: '/catalogos', disponible: true }
  ];

  constructor(private authService: AuthService) {
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }
}
