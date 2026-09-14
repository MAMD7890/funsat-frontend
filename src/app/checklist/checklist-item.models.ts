import { CategoriaCatalogoResponse } from '../catalogos/catalogo.models';

export interface ChecklistItemRequest {
  categoriaId: number;
  nombre: string;
  orden: number;
  activo?: boolean | null;
}

export interface ChecklistItemResponse {
  id: number;
  categoria: CategoriaCatalogoResponse;
  nombre: string;
  orden: number;
  activo: boolean;
}
