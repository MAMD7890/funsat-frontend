import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Termino de busqueda del recuadro de la barra superior. Es contextual:
 * el navbar decide en que modulos mostrarlo y con que placeholder, y cada
 * listado que lo soporta se suscribe a `termino$` para filtrar sus propios
 * resultados (via backend, con paginacion server-side).
 */
@Injectable({ providedIn: 'root' })
export class BusquedaGlobalService {

  private readonly entrada = new Subject<string>();
  private readonly actual = new BehaviorSubject<string>('');

  readonly termino$ = this.actual.asObservable();

  constructor() {
    this.entrada.pipe(debounceTime(300), distinctUntilChanged()).subscribe(valor => this.actual.next(valor));
  }

  get terminoActual(): string {
    return this.actual.value;
  }

  escribir(valor: string): void {
    this.entrada.next(valor);
  }

  /** Limpia de inmediato, sin esperar el debounce (usado al cambiar de modulo). */
  limpiar(): void {
    this.entrada.next('');
    this.actual.next('');
  }
}
