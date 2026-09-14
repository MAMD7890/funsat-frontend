import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CategoriaCatalogoResponse } from '../../catalogos/catalogo.models';

/**
 * Espeja las reglas de EquipoRequestValidator del backend: numeroSerie
 * obligatorio segun si la categoria seleccionada lo exige (dato del
 * catalogo, no una lista fija), cliente/fechaIngreso obligatorios si es
 * EXTERNO, prohibidos si es PROPIO. Da feedback inmediato en el form antes
 * de llegar al backend (que igual las vuelve a validar).
 *
 * Recibe un getter (no el array directo) porque el array de categorias
 * llega async despues de crear el form; un getter siempre lee el valor
 * actual del componente en vez de quedar atado al array vacio inicial.
 */
export function validarEquipoForm(getCategorias: () => CategoriaCatalogoResponse[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const categoriaId = control.get('categoriaId')?.value;
    const numeroSerie = control.get('numeroSerie')?.value;
    const propiedad = control.get('propiedad')?.value;
    const clienteId = control.get('clienteId')?.value;
    const fechaIngreso = control.get('fechaIngreso')?.value;

    const errores: ValidationErrors = {};

    const categoria = getCategorias().find(c => c.id === categoriaId);
    if (categoria?.requiereNumeroSerie && !numeroSerie) {
      errores['numeroSerieRequerido'] = true;
    }

    if (propiedad === 'EXTERNO') {
      if (!clienteId) {
        errores['clienteRequerido'] = true;
      }
      if (!fechaIngreso) {
        errores['fechaIngresoRequerida'] = true;
      }
    }

    return Object.keys(errores).length > 0 ? errores : null;
  };
}
