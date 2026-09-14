import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html'
})
export class ComingSoonComponent implements OnInit {
  @Input() titulo = 'Este módulo';
  @Input() icono = 'fa-tools';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.titulo = data['titulo'] ?? this.titulo;
    this.icono = data['icono'] ?? this.icono;
  }
}
