import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea un monto en pesos colombianos: "$" siempre antes del numero, sin
 * decimales (COP no usa centavos en la practica) y con puntos de miles.
 * El pipe "currency" de Angular no sirve aqui: bajo el locale 'es' coloca el
 * simbolo DESPUES del numero ("15.060.261 $"), que es la convencion de
 * Espana/euro, no la colombiana.
 */
@Pipe({ name: 'cop' })
export class CopPipe implements PipeTransform {

  transform(valor: number | string | null | undefined): string {
    if (valor === null || valor === undefined || valor === '') {
      return '—';
    }
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(numero)) {
      return '—';
    }
    return '$' + formatNumber(numero, 'es', '1.0-0');
  }
}
