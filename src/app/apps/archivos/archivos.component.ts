import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

type TipoItem = 'carpeta' | 'pdf' | 'imagen' | 'excel';

interface ItemArchivo {
  nombre: string;
  tipo: TipoItem;
  tamano?: string;
  hijos?: ItemArchivo[];
}

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html'
})
export class ArchivosComponent {

  private raiz: ItemArchivo = {
    nombre: 'Raíz', tipo: 'carpeta', hijos: [
      {
        nombre: 'Manuales', tipo: 'carpeta', hijos: [
          { nombre: 'Manual Retroexcavadora CAT 320.pdf', tipo: 'pdf', tamano: '4.2 MB' },
          { nombre: 'Manual Pulidora Dewalt.pdf', tipo: 'pdf', tamano: '1.1 MB' }
        ]
      },
      {
        nombre: 'Fichas Técnicas', tipo: 'carpeta', hijos: [
          { nombre: 'Ficha - Camioneta Ford F-150.xlsx', tipo: 'excel', tamano: '85 KB' }
        ]
      },
      {
        nombre: 'Fotos Equipos', tipo: 'carpeta', hijos: [
          { nombre: 'antes-frenos-camion.jpg', tipo: 'imagen', tamano: '2.3 MB' },
          { nombre: 'despues-frenos-camion.jpg', tipo: 'imagen', tamano: '2.1 MB' }
        ]
      },
      { nombre: 'Inventario_Master.xlsx', tipo: 'excel', tamano: '320 KB' }
    ]
  };

  ruta: ItemArchivo[] = [this.raiz];

  constructor(private toastr: ToastrService) {
  }

  get carpetaActual(): ItemArchivo {
    return this.ruta[this.ruta.length - 1];
  }

  abrir(item: ItemArchivo): void {
    if (item.tipo === 'carpeta') {
      this.ruta = [...this.ruta, item];
    } else {
      this.toastr.info('Vista previa no disponible en esta demo.');
    }
  }

  irA(indice: number): void {
    this.ruta = this.ruta.slice(0, indice + 1);
  }

  icono(tipo: TipoItem): string {
    switch (tipo) {
      case 'carpeta': return 'fa-folder';
      case 'pdf': return 'fa-file-pdf';
      case 'imagen': return 'fa-file-image';
      case 'excel': return 'fa-file-excel';
      default: return 'fa-file';
    }
  }
}
