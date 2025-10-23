import { Component } from '@angular/core';

interface Contacto {
  nombre: string;
  avatar: string;
  mensaje: string;
}

interface Mensaje {
  texto: string;
  hora: string;
  emisor: 'yo' | 'otro';
}

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent {
  contactos: Contacto[] = [
    { nombre: 'Anton Green', avatar: 'https://i.pravatar.cc/40?img=5', mensaje: 'Nos vemos mañana 👋' },
    { nombre: 'Sara López', avatar: 'https://i.pravatar.cc/40?img=7', mensaje: 'Ya publiqué el artículo nuevo' },
    { nombre: 'Carlos Ruiz', avatar: 'https://i.pravatar.cc/40?img=8', mensaje: 'Revisé tu propuesta' },
    { nombre: 'Laura Díaz', avatar: 'https://i.pravatar.cc/40?img=9', mensaje: 'Gracias por el intercambio 😊' }
  ];

  mensajes: Mensaje[] = [
    { texto: 'Hola Anton, ¿cómo vas?', hora: '10:15 AM', emisor: 'yo' },
    { texto: 'Todo bien, ¿y tú?', hora: '10:16 AM', emisor: 'otro' },
    { texto: 'Bien también, ¿confirmamos lo de mañana?', hora: '10:17 AM', emisor: 'yo' },
    { texto: 'Sí, a la misma hora.', hora: '10:18 AM', emisor: 'otro' }
  ];

  nuevoMensaje: string = '';
  contactoSeleccionado: Contacto | null = this.contactos[0];

  seleccionarContacto(contacto: Contacto) {
    this.contactoSeleccionado = contacto;
    this.mensajes = [
      { texto: `Hola ${contacto.nombre}, ¿todo bien?`, hora: '9:00 AM', emisor: 'yo' },
      { texto: 'Sí, todo perfecto 😄', hora: '9:01 AM', emisor: 'otro' }
    ];
  }

  enviarMensaje() {
    if (this.nuevoMensaje.trim() === '') return;

    const nuevo: Mensaje = {
      texto: this.nuevoMensaje,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emisor: 'yo'
    };

    this.mensajes.push(nuevo);
    this.nuevoMensaje = '';

    // Simula respuesta automática
    setTimeout(() => {
      this.mensajes.push({
        texto: 'Recibido 👍',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emisor: 'otro'
      });
    }, 1000);
  }
}
