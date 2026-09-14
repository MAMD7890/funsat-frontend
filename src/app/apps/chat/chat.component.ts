import { Component } from '@angular/core';

interface Mensaje {
  autor: 'yo' | 'otro';
  texto: string;
  hora: string;
}

interface Conversacion {
  id: number;
  nombre: string;
  iniciales: string;
  ultimoMensaje: string;
  noLeidos: number;
  mensajes: Mensaje[];
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent {

  conversaciones: Conversacion[] = [
    {
      id: 1, nombre: 'Carlos Técnico', iniciales: 'CT', ultimoMensaje: 'Ya revisé los frenos del camión', noLeidos: 2,
      mensajes: [
        { autor: 'otro', texto: 'Buenas, ¿ya llegó el repuesto para la retroexcavadora?', hora: '09:12' },
        { autor: 'yo', texto: 'Sí, llegó esta mañana. Puedes pasar a recogerlo.', hora: '09:15' },
        { autor: 'otro', texto: 'Perfecto, ya revisé los frenos del camión también.', hora: '09:40' }
      ]
    },
    {
      id: 2, nombre: 'Ana Supervisor', iniciales: 'AS', ultimoMensaje: 'Confirmado, gracias', noLeidos: 0,
      mensajes: [
        { autor: 'otro', texto: '¿Cómo va el diagnóstico de la motobomba?', hora: 'Ayer' },
        { autor: 'yo', texto: 'Va avanzado, mañana debería estar lista.', hora: 'Ayer' },
        { autor: 'otro', texto: 'Confirmado, gracias', hora: 'Ayer' }
      ]
    },
    {
      id: 3, nombre: 'Juan Pérez (cliente)', iniciales: 'JP', ultimoMensaje: '¿Cuándo puedo recoger el equipo?', noLeidos: 1,
      mensajes: [
        { autor: 'otro', texto: '¿Cuándo puedo recoger el equipo?', hora: '11:02' }
      ]
    }
  ];

  conversacionActivaId = this.conversaciones[0].id;
  borrador = '';

  get conversacionActiva(): Conversacion {
    return this.conversaciones.find(c => c.id === this.conversacionActivaId)!;
  }

  seleccionar(conversacion: Conversacion): void {
    this.conversacionActivaId = conversacion.id;
    conversacion.noLeidos = 0;
  }

  enviar(): void {
    const texto = this.borrador.trim();
    if (!texto) {
      return;
    }
    const conversacion = this.conversacionActiva;
    conversacion.mensajes.push({ autor: 'yo', texto, hora: 'Ahora' });
    conversacion.ultimoMensaje = texto;
    this.borrador = '';
  }
}
