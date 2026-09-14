import { Component } from '@angular/core';

@Component({
  selector: 'app-no-autorizado',
  template: `
    <div class="coming-soon">
      <i class="fa fa-lock icon" style="color: var(--danger);"></i>
      <h4>Acceso no autorizado</h4>
      <p>Tu rol no tiene permiso para ver esta página.</p>
      <a routerLink="/dashboard" class="btn btn-brand">Volver al dashboard</a>
    </div>
  `
})
export class NoAutorizadoComponent {
}
