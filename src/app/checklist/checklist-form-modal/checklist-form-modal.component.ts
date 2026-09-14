import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { CategoriaCatalogoResponse } from '../../catalogos/catalogo.models';
import { CategoriaCatalogoService } from '../../catalogos/catalogo.service';
import { ChecklistItemResponse } from '../checklist-item.models';
import { ChecklistItemService } from '../checklist-item.service';

@Component({
  selector: 'app-checklist-form-modal',
  templateUrl: './checklist-form-modal.component.html'
})
export class ChecklistFormModalComponent implements OnInit {

  @Input() item: ChecklistItemResponse | null = null;
  @Input() categoriaInicial: number | null = null;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;
  categorias: CategoriaCatalogoResponse[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private checklistItemService: ChecklistItemService,
    private categoriaCatalogoService: CategoriaCatalogoService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      categoriaId: [null, Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      orden: [0],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.categoriaCatalogoService.listar().subscribe(categorias => {
      this.categorias = categorias;
      if (!this.item && this.form.value.categoriaId === null) {
        this.form.patchValue({ categoriaId: this.categoriaInicial ?? categorias[0]?.id ?? null });
      }
    });

    if (this.item) {
      this.form.patchValue({ ...this.item, categoriaId: this.item.categoria.id });
    } else if (this.categoriaInicial !== null) {
      this.form.patchValue({ categoriaId: this.categoriaInicial });
    }
  }

  get esEdicion(): boolean {
    return !!this.item;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Completa el nombre del ítem antes de guardar.');
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;
    const request = this.form.value;

    const accion$ = this.esEdicion
      ? this.checklistItemService.actualizar(this.item!.id, request)
      : this.checklistItemService.crear(request);

    accion$.subscribe({
      next: item => {
        this.guardando = false;
        this.activeModal.close(item);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar el ítem.';
      }
    });
  }
}
