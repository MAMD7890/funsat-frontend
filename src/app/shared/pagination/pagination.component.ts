import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageResponse } from '../../core/models/page.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {

  @Input() page: PageResponse<unknown> | null = null;
  @Output() cambiarPagina = new EventEmitter<number>();

  get desde(): number {
    if (!this.page || this.page.empty) {
      return 0;
    }
    return this.page.number * this.page.size + 1;
  }

  get hasta(): number {
    if (!this.page) {
      return 0;
    }
    return this.page.number * this.page.size + this.page.content.length;
  }

  get paginas(): number[] {
    if (!this.page) {
      return [];
    }
    return Array.from({ length: this.page.totalPages }, (_, i) => i);
  }

  ir(pagina: number): void {
    if (!this.page || pagina < 0 || pagina >= this.page.totalPages || pagina === this.page.number) {
      return;
    }
    this.cambiarPagina.emit(pagina);
  }
}
