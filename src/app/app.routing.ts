import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComingSoonComponent } from './shared/coming-soon/coming-soon.component';
import { NoAutorizadoComponent } from './shared/no-autorizado/no-autorizado.component';

import { EquipoListadoComponent } from './equipos/equipo-listado/equipo-listado.component';
import { EquipoDetalleComponent } from './equipos/equipo-detalle/equipo-detalle.component';

import { ClienteListadoComponent } from './clientes/cliente-listado/cliente-listado.component';

import { RepuestoListadoComponent } from './repuestos/repuesto-listado/repuesto-listado.component';
import { ChecklistListadoComponent } from './checklist/checklist-listado/checklist-listado.component';

import { ServicioListadoComponent } from './servicios/servicio-listado/servicio-listado.component';
import { ServicioDetalleComponent } from './servicios/servicio-detalle/servicio-detalle.component';

import { ImportacionComponent } from './importacion/importacion.component';

import { RolesComponent } from './roles/roles.component';

import { UsuarioListadoComponent } from './usuarios/usuario-listado/usuario-listado.component';

import { AuditoriaListadoComponent } from './auditoria/auditoria-listado/auditoria-listado.component';

import { ReportesComponent } from './reportes/reportes.component';

import { CatalogosComponent } from './catalogos/catalogos.component';

import { PerfilComponent } from './perfil/perfil.component';

import { OrdenListadoComponent } from './movimientos/orden-listado/orden-listado.component';
import { OrdenDetalleComponent } from './movimientos/orden-detalle/orden-detalle.component';

import { KanbanComponent } from './apps/kanban/kanban.component';
import { ChatComponent } from './apps/chat/chat.component';
import { CalendarioComponent } from './apps/calendario/calendario.component';
import { ArchivosComponent } from './apps/archivos/archivos.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cambiar-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'no-autorizado', component: NoAutorizadoComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },

      { path: 'equipos', component: EquipoListadoComponent },
      { path: 'equipos/:id', component: EquipoDetalleComponent },

      { path: 'clientes', component: ClienteListadoComponent },

      { path: 'servicios', component: ServicioListadoComponent },
      { path: 'servicios/:id', component: ServicioDetalleComponent },

      { path: 'reportes', component: ReportesComponent },

      { path: 'repuestos', component: RepuestoListadoComponent },
      { path: 'checklist', component: ChecklistListadoComponent },

      { path: 'movimientos', component: OrdenListadoComponent },
      { path: 'movimientos/:id', component: OrdenDetalleComponent },

      {
        path: 'importacion',
        component: ImportacionComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
      },

      {
        path: 'usuarios',
        component: UsuarioListadoComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
      },
      {
        path: 'auditoria',
        component: AuditoriaListadoComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
      },
      {
        path: 'catalogos',
        component: CatalogosComponent,
        data: { roles: ['ADMIN'] },
        canActivate: [RoleGuard]
      },

      { path: 'apps/calendario', component: CalendarioComponent },
      { path: 'apps/kanban', component: KanbanComponent },
      { path: 'apps/chat', component: ChatComponent },
      { path: 'apps/archivos', component: ArchivosComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
