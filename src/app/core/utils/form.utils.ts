/**
 * Convierte los strings vacíos de un objeto (tal como los deja un formulario
 * reactivo en un campo de texto que el usuario no llenó) a null antes de
 * mandarlos al backend. Necesario porque @Pattern en el backend, a
 * diferencia de @Email/@NotBlank, no trata "" como válido — solo null.
 */
export function limpiarBlancos<T extends Record<string, unknown>>(valor: T): T {
  const resultado = { ...valor };
  for (const key of Object.keys(resultado)) {
    if (resultado[key] === '') {
      (resultado as Record<string, unknown>)[key] = null;
    }
  }
  return resultado;
}
