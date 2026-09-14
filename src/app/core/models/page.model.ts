/** Misma forma que Page<T> de Spring Data (ver EquipoController, ClienteController, etc). */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
