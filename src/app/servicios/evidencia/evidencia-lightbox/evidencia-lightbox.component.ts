import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TIPO_EVIDENCIA_LABEL } from '../evidencia.models';

@Component({
  selector: 'app-evidencia-lightbox',
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <span class="badge badge-info mr-2">{{ tipoLabel[tipo] }}</span>
        {{ descripcion || 'Evidencia fotográfica' }}
      </h5>
      <button type="button" class="close" (click)="activeModal.dismiss()">
        <span>&times;</span>
      </button>
    </div>
    <div class="modal-body text-center p-0">
      <img [src]="objectUrl" style="max-width: 100%; max-height: 75vh;" alt="Evidencia fotográfica" />
    </div>
  `
})
export class EvidenciaLightboxComponent {
  @Input() objectUrl: SafeUrl | string = '';
  @Input() tipo: 'ANTES' | 'DESPUES' = 'ANTES';
  @Input() descripcion: string | null = null;

  tipoLabel = TIPO_EVIDENCIA_LABEL;

  constructor(public activeModal: NgbActiveModal) {
  }
}
