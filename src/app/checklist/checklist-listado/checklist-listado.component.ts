import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { CategoriaCatalogoResponse } from '../../catalogos/catalogo.models';
import { CategoriaCatalogoService } from '../../catalogos/catalogo.service';
import { ChecklistFormModalComponent } from '../checklist-form-modal/checklist-form-modal.component';
import { ChecklistItemResponse } from '../checklist-item.models';
import { ChecklistItemService } from '../checklist-item.service';

@Component({
  selector: 'app-checklist-listado',
  templateUrl: './checklist-listado.component.html'
})
export class ChecklistListadoComponent implements OnInit {

  items: ChecklistItemResponse[] = [];
  cargando = false;
  categorias: CategoriaCatalogoResponse[] = [];
  categoriaFiltro: number | null = null;

  constructor(
    private checklistItemService: ChecklistItemService,
    private categoriaCatalogoService: CategoriaCatalogoService,
    private modalService: NgbModal,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.categoriaCatalogoService.listar().subscribe(categorias => this.categorias = categorias);
    this.cargar();
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  itemsPorCategoria(categoriaId: number): ChecklistItemResponse[] {
    return this.items.filter(i => i.categoria.id === categoriaId);
  }

  cargar(): void {
    this.cargando = true;
    this.checklistItemService.listar(this.categoriaFiltro).subscribe({
      next: items => {
        this.items = items;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar el checklist.');
      }
    });
  }

  nuevoItem(categoriaId: number): void {
    const ref = this.modalService.open(ChecklistFormModalComponent, { centered: true });
    ref.componentInstance.categoriaInicial = categoriaId;
    ref.result.then(
      () => {
        this.toastr.success('Ítem creado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  editarItem(item: ChecklistItemResponse): void {
    const ref = this.modalService.open(ChecklistFormModalComponent, { centered: true });
    ref.componentInstance.item = item;
    ref.result.then(
      () => {
        this.toastr.success('Ítem actualizado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  async eliminarItem(item: ChecklistItemResponse): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      'Eliminar ítem',
      `¿Eliminar "${item.nombre}"? Si ya fue usado en algún servicio, no se podrá borrar.`
    );
    if (!confirmado) {
      return;
    }

    this.checklistItemService.eliminar(item.id).subscribe({
      next: () => {
        this.toastr.success('Ítem eliminado.');
        this.cargar();
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? 'No se pudo eliminar el ítem.';
        this.toastr.error(mensaje);
      }
    });
  }
}
