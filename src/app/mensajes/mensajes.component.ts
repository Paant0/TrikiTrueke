import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import io from "socket.io-client";
import { CommonModule } from '@angular/common';


interface Mensaje {
  texto: string;
  hora: string;
  emisor: string;
}

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})

export class MensajesComponent implements OnInit, OnDestroy {
  private socket: any;
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  usuario: string = '';

  ngOnInit() {
    this.socket = io('http://localhost:3000');

    this.usuario = 'Usuario_' + Math.floor(Math.random() * 1000);

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

    this.socket.emit('mensaje', msg);
    this.mensajes.push(msg);

    this.nuevoMensaje = '';
  }

  ngOnDestroy() {
    this.socket?.disconnect();
  }
}
