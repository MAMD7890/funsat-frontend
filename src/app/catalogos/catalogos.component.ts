import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoriaCatalogoResponse, TipoMotorCatalogoResponse } from './catalogo.models';
import { CategoriaCatalogoService, TipoMotorCatalogoService } from './catalogo.service';
import { CategoriaFormModalComponent } from './categoria-form-modal/categoria-form-modal.component';
import { TipoMotorFormModalComponent } from './tipo-motor-form-modal/tipo-motor-form-modal.component';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html'
})
export class CatalogosComponent implements OnInit {

  categorias: CategoriaCatalogoResponse[] = [];
  motores: TipoMotorCatalogoResponse[] = [];
  cargandoCategorias = false;
  cargandoMotores = false;

  constructor(
    private categoriaCatalogoService: CategoriaCatalogoService,
    private tipoMotorCatalogoService: TipoMotorCatalogoService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarMotores();
  }

  private cargarCategorias(): void {
    this.cargandoCategorias = true;
    this.categoriaCatalogoService.listar(false).subscribe({
      next: categorias => {
        this.categorias = categorias;
        this.cargandoCategorias = false;
      },
      error: () => {
        this.cargandoCategorias = false;
        this.toastr.error('No se pudo cargar las categorías.');
      }
    });
  }

  private cargarMotores(): void {
    this.cargandoMotores = true;
    this.tipoMotorCatalogoService.listar(false).subscribe({
      next: motores => {
        this.motores = motores;
        this.cargandoMotores = false;
      },
      error: () => {
        this.cargandoMotores = false;
        this.toastr.error('No se pudo cargar los tipos de motor.');
      }
    });
  }

  nuevaCategoria(): void {
    const ref = this.modalService.open(CategoriaFormModalComponent, { centered: true });
    ref.result.then(
      () => {
        this.toastr.success('Categoría creada correctamente.');
        this.cargarCategorias();
      },
      () => undefined
    );
  }

  editarCategoria(categoria: CategoriaCatalogoResponse): void {
    const ref = this.modalService.open(CategoriaFormModalComponent, { centered: true });
    ref.componentInstance.categoria = categoria;
    ref.result.then(
      () => {
        this.toastr.success('Categoría actualizada correctamente.');
        this.cargarCategorias();
      },
      () => undefined
    );
  }

  alternarActivaCategoria(categoria: CategoriaCatalogoResponse): void {
    this.categoriaCatalogoService.actualizar(categoria.id, { ...categoria, activo: !categoria.activo }).subscribe({
      next: () => {
        this.toastr.success(categoria.activo ? 'Categoría desactivada.' : 'Categoría activada.');
        this.cargarCategorias();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? 'No se pudo actualizar la categoría.')
    });
  }

  nuevoMotor(): void {
    const ref = this.modalService.open(TipoMotorFormModalComponent, { centered: true });
    ref.result.then(
      () => {
        this.toastr.success('Tipo de motor creado correctamente.');
        this.cargarMotores();
      },
      () => undefined
    );
  }

  editarMotor(motor: TipoMotorCatalogoResponse): void {
    const ref = this.modalService.open(TipoMotorFormModalComponent, { centered: true });
    ref.componentInstance.motor = motor;
    ref.result.then(
      () => {
        this.toastr.success('Tipo de motor actualizado correctamente.');
        this.cargarMotores();
      },
      () => undefined
    );
  }

  alternarActivoMotor(motor: TipoMotorCatalogoResponse): void {
    this.tipoMotorCatalogoService.actualizar(motor.id, { ...motor, activo: !motor.activo }).subscribe({
      next: () => {
        this.toastr.success(motor.activo ? 'Tipo de motor desactivado.' : 'Tipo de motor activado.');
        this.cargarMotores();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? 'No se pudo actualizar el tipo de motor.')
    });
  }
}
