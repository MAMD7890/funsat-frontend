import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  constructor(private modalService: NgbModal) {
  }

  confirmar(titulo: string, mensaje: string, textoConfirmar = 'Eliminar'): Promise<boolean> {
    const ref = this.modalService.open(ConfirmDialogComponent, { centered: true, size: 'sm' });
    ref.componentInstance.titulo = titulo;
    ref.componentInstance.mensaje = mensaje;
    ref.componentInstance.textoConfirmar = textoConfirmar;
    return ref.result.then(() => true).catch(() => false);
  }
}
