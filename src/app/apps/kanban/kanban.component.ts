import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServicioFormModalComponent } from '../../servicios/servicio-form-modal/servicio-form-modal.component';
import { ESTADO_SERVICIO_LABEL, EstadoServicio, ServicioResponse, TIPO_SERVICIO_LABEL } from '../../servicios/servicio.models';
import { ServicioService } from '../../servicios/servicio.service';

interface Columna {
  id: EstadoServicio;
  titulo: string;
  servicios: ServicioResponse[];
}

const ORDEN_COLUMNAS: EstadoServicio[] = ['REGISTRADO', 'EN_PROGRESO', 'EN_REVISION', 'COMPLETADO'];

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html'
})
export class KanbanComponent implements OnInit {

  columnas: Columna[] = ORDEN_COLUMNAS.map(id => ({ id, titulo: ESTADO_SERVICIO_LABEL[id], servicios: [] }));
  idsConectados = this.columnas.map(c => c.id);
  cargando = false;
  tipoLabel = TIPO_SERVICIO_LABEL;

  constructor(
    private servicioService: ServicioService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.servicioService.listarTodosParaKanban().subscribe({
      next: pagina => {
        this.columnas.forEach(c => c.servicios = []);
        pagina.content.forEach(servicio => {
          const columna = this.columnas.find(c => c.id === servicio.estado);
          if (columna) {
            columna.servicios.push(servicio);
          }
        });
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.toastr.error('No se pudo cargar el tablero de servicios.');
      }
    });
  }

  iniciales(nombre: string | null | undefined): string {
    return (nombre || '?').trim().charAt(0).toUpperCase();
  }

  verServicio(servicio: ServicioResponse): void {
    this.router.navigate(['/servicios', servicio.id]);
  }

  nuevoServicio(): void {
    const ref = this.modalService.open(ServicioFormModalComponent, { centered: true, size: 'lg' });
    ref.result.then(
      () => {
        this.toastr.success('Servicio creado correctamente.');
        this.cargar();
      },
      () => undefined
    );
  }

  drop(event: CdkDragDrop<ServicioResponse[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const servicio = event.previousContainer.data[event.previousIndex];
    const nuevoEstado = event.container.id as EstadoServicio;
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

    this.servicioService.cambiarEstado(servicio.id, nuevoEstado).subscribe({
      next: () => this.toastr.success(`"${servicio.descripcion.slice(0, 40)}" movido a "${ESTADO_SERVICIO_LABEL[nuevoEstado]}".`),
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'No se pudo actualizar el estado del servicio.');
        this.cargar();
      }
    });
  }
}
