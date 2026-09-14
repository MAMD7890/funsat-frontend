import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorResponse } from '../../core/models/api-error.model';
import { CategoriaCatalogoResponse } from '../catalogo.models';
import { CategoriaCatalogoService } from '../catalogo.service';

@Component({
  selector: 'app-categoria-form-modal',
  templateUrl: './categoria-form-modal.component.html'
})
export class CategoriaFormModalComponent implements OnInit {

  @Input() categoria: CategoriaCatalogoResponse | null = null;

  form: FormGroup;
  guardando = false;
  errorGeneral: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private categoriaCatalogoService: CategoriaCatalogoService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(80)]],
      requiereNumeroSerie: [false],
      orden: [0],
      activo: [true]
    });
  }

  ngOnInit(): void {
    if (this.categoria) {
      this.form.patchValue(this.categoria);
    }
  }

  get esEdicion(): boolean {
    return !!this.categoria;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorGeneral = null;
    this.guardando = true;
    const request = this.form.value;

    const accion$ = this.esEdicion
      ? this.categoriaCatalogoService.actualizar(this.categoria!.id, request)
      : this.categoriaCatalogoService.crear(request);

    accion$.subscribe({
      next: categoria => {
        this.guardando = false;
        this.activeModal.close(categoria);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo guardar la categoría.';
      }
    });
  }
}
