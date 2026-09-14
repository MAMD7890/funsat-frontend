import { Component } from '@angular/core';
import { routeFadeAnimation } from '../core/animations/route-animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  animations: [routeFadeAnimation]
})
export class LayoutComponent {

  sidebarAbierto = false;
  anioActual = new Date().getFullYear();

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }
}
