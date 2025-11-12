import { Component, OnInit, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';

interface Mensaje {
  texto: string;
  hora: string;
  emisor: string;
}

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit, OnDestroy {
  private socket!: Socket;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  usuario: string = ''; // cada usuario elige su nombre

  ngOnInit() {
    // 👉 Conectarse al servidor Socket.io
    this.socket = io('http://localhost:3000');

    // Asignar nombre aleatorio
    this.usuario = 'Usuario_' + Math.floor(Math.random() * 1000);

    // Escuchar mensajes de otros usuarios
    this.socket.on('mensaje', (data: Mensaje) => {
      this.mensajes.push(data);
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const msg: Mensaje = {
      texto: this.nuevoMensaje,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emisor: this.usuario
    };

    // Enviar al servidor
    this.socket.emit('mensaje', msg);
    this.nuevoMensaje = '';
  }

  ngOnDestroy() {
    if (this.socket) this.socket.disconnect();
  }
}
