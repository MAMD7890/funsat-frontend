import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

registerLocaleData(localeEs);

import { AppRoutingModule } from './app.routing';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { AppComponent } from './app.component';
import { CopPipe } from './core/pipes/cop.pipe';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

// Layout
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Shared
import { ComingSoonComponent } from './shared/coming-soon/coming-soon.component';
import { NoAutorizadoComponent } from './shared/no-autorizado/no-autorizado.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

// Equipos
import { EquipoListadoComponent } from './equipos/equipo-listado/equipo-listado.component';
import { EquipoFormModalComponent } from './equipos/equipo-form-modal/equipo-form-modal.component';
import { EquipoDetalleComponent } from './equipos/equipo-detalle/equipo-detalle.component';
import { DocumentoEquipoComponent } from './equipos/documento-equipo/documento-equipo.component';

// Clientes
import { ClienteListadoComponent } from './clientes/cliente-listado/cliente-listado.component';
import { ClienteFormModalComponent } from './clientes/cliente-form-modal/cliente-form-modal.component';

// Repuestos
import { RepuestoListadoComponent } from './repuestos/repuesto-listado/repuesto-listado.component';
import { RepuestoFormModalComponent } from './repuestos/repuesto-form-modal/repuesto-form-modal.component';

// Checklist
import { ChecklistListadoComponent } from './checklist/checklist-listado/checklist-listado.component';
import { ChecklistFormModalComponent } from './checklist/checklist-form-modal/checklist-form-modal.component';

// Servicios
import { ServicioListadoComponent } from './servicios/servicio-listado/servicio-listado.component';
import { ServicioFormModalComponent } from './servicios/servicio-form-modal/servicio-form-modal.component';
import { ServicioDetalleComponent } from './servicios/servicio-detalle/servicio-detalle.component';

// Evidencia fotográfica
import { EvidenciaFotograficaComponent } from './servicios/evidencia/evidencia-fotografica.component';
import { EvidenciaLightboxComponent } from './servicios/evidencia/evidencia-lightbox/evidencia-lightbox.component';

// Importación Excel
import { ImportacionComponent } from './importacion/importacion.component';

// Roles y Permisos
import { RolesComponent } from './roles/roles.component';

// Usuarios
import { UsuarioListadoComponent } from './usuarios/usuario-listado/usuario-listado.component';
import { UsuarioFormModalComponent } from './usuarios/usuario-form-modal/usuario-form-modal.component';
import { UsuarioResetPasswordModalComponent } from './usuarios/usuario-reset-password-modal/usuario-reset-password-modal.component';

// Auditoría
import { AuditoriaListadoComponent } from './auditoria/auditoria-listado/auditoria-listado.component';

// Reportes
import { ReportesComponent } from './reportes/reportes.component';

// Catálogos (categorías y tipos de motor)
import { CatalogosComponent } from './catalogos/catalogos.component';
import { CategoriaFormModalComponent } from './catalogos/categoria-form-modal/categoria-form-modal.component';
import { TipoMotorFormModalComponent } from './catalogos/tipo-motor-form-modal/tipo-motor-form-modal.component';

// Mi perfil
import { PerfilComponent } from './perfil/perfil.component';

// Recordatorios de mantenimiento
import { RecordatorioFormModalComponent } from './recordatorios/recordatorio-form-modal/recordatorio-form-modal.component';
import { RecordatorioDiaModalComponent } from './recordatorios/recordatorio-dia-modal/recordatorio-dia-modal.component';

// Movimientos de equipos (ordenes de salida / entrada)
import { OrdenListadoComponent } from './movimientos/orden-listado/orden-listado.component';
import { OrdenFormModalComponent } from './movimientos/orden-form-modal/orden-form-modal.component';
import { OrdenDetalleComponent } from './movimientos/orden-detalle/orden-detalle.component';
import { DevolucionModalComponent } from './movimientos/devolucion-modal/devolucion-modal.component';

// Apps de demostración
import { KanbanComponent } from './apps/kanban/kanban.component';
import { ChatComponent } from './apps/chat/chat.component';
import { CalendarioComponent } from './apps/calendario/calendario.component';
import { ArchivosComponent } from './apps/archivos/archivos.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      extendedTimeOut: 1500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      easeTime: 200,
      tapToDismiss: true
    }),
    DragDropModule
  ],
  declarations: [
    AppComponent,
    CopPipe,
    LoginComponent,
    ChangePasswordComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    ComingSoonComponent,
    NoAutorizadoComponent,
    PaginationComponent,
    ConfirmDialogComponent,
    EquipoListadoComponent,
    EquipoFormModalComponent,
    EquipoDetalleComponent,
    DocumentoEquipoComponent,
    ClienteListadoComponent,
    ClienteFormModalComponent,
    RepuestoListadoComponent,
    RepuestoFormModalComponent,
    ChecklistListadoComponent,
    ChecklistFormModalComponent,
    ServicioListadoComponent,
    ServicioFormModalComponent,
    ServicioDetalleComponent,
    EvidenciaFotograficaComponent,
    EvidenciaLightboxComponent,
    ImportacionComponent,
    RolesComponent,
    UsuarioListadoComponent,
    UsuarioFormModalComponent,
    UsuarioResetPasswordModalComponent,
    AuditoriaListadoComponent,
    ReportesComponent,
    CatalogosComponent,
    CategoriaFormModalComponent,
    TipoMotorFormModalComponent,
    PerfilComponent,
    RecordatorioFormModalComponent,
    RecordatorioDiaModalComponent,
    OrdenListadoComponent,
    OrdenFormModalComponent,
    OrdenDetalleComponent,
    DevolucionModalComponent,
    KanbanComponent,
    ChatComponent,
    CalendarioComponent,
    ArchivosComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
