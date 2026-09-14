import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UsuarioResponse } from '../../core/models/auth.models';
import { PageResponse } from '../../core/models/page.model';
import { UsuarioService } from '../../usuarios/usuario.service';
import {
  ACCION_AUDITORIA_BADGE,
  ACCION_AUDITORIA_ICONO,
  ACCION_AUDITORIA_LABEL,
  AuditoriaResponse,
  ENTIDADES_AUDITABLES,
  ENTIDAD_AUDITORIA_LABEL
} from '../auditoria.models';
import { AuditoriaService, FiltrosAuditoria } from '../auditoria.service';

@Component({
  selector: 'app-auditoria-listado',
  templateUrl: './auditoria-listado.component.html'
})
export class AuditoriaListadoComponent implements OnInit, OnDestroy {

  page: PageResponse<AuditoriaResponse> | null = null;
  usuarios: UsuarioResponse[] = [];
  cargando = false;

  accionLabel = ACCION_AUDITORIA_LABEL;
  accionBadge = ACCION_AUDITORIA_BADGE;
  accionIcono = ACCION_AUDITORIA_ICONO;
  entidadLabel = ENTIDAD_AUDITORIA_LABEL;
  entidades = ENTIDADES_AUDITABLES;

  filtros: FiltrosAuditoria = {};

  private cargaSub?: Subscription;

  constructor(
    private auditoriaService: AuditoriaService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.cargar(0);
    this.usuarioService.listarTodos().subscribe({
      next: usuarios => this.usuarios = usuarios,
      error: () => undefined
    });
  }

  ngOnDestroy(): void {
    this.cargaSub?.unsubscribe();
  }

  cargar(pagina: number): void {
    this.cargaSub?.unsubscribe();
    this.cargando = true;
    this.cargaSub = this.auditoriaService.listar(pagina, this.filtros).subscribe({
      next: page => {
        this.page = page;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar el registro de auditoría.');
      }
    });
  }

  aplicarFiltros(): void {
    this.cargar(0);
  }

  limpiarFiltros(): void {
    this.filtros = {};
    this.cargar(0);
  }
}
