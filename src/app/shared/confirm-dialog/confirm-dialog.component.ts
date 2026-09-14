import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="modal-body text-center py-4">
      <span class="stat-icon warning mb-3" style="width: 56px; height: 56px; font-size: 1.4rem;">
        <i class="fa fa-exclamation-triangle"></i>
      </span>
      <h5>{{ titulo }}</h5>
      <p class="text-muted-soft mb-0">{{ mensaje }}</p>
    </div>
    <div class="modal-footer justify-content-center">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.dismiss()">Cancelar</button>
      <button type="button" class="btn btn-danger" (click)="activeModal.close(true)">{{ textoConfirmar }}</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() titulo = '¿Estás seguro?';
  @Input() mensaje = 'Esta acción no se puede deshacer.';
  @Input() textoConfirmar = 'Eliminar';

  constructor(public activeModal: NgbActiveModal) {
  }
}
