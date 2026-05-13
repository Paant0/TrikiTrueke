import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule, MatChipsModule],
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent {
  temaSeleccionado: string | null = null;
  tituloExplicacion = '';
  textoExplicacion = '';
  
  faqs = [
    {
      pregunta: '¿TrikiTrueke tiene costo?',
      respuesta: 'No, usar la plataforma es completamente gratuito. Puedes crear una cuenta y empezar a publicar artículos sin pagar nada.'
    },
    {
      pregunta: '¿Qué hago si un usuario incumple el trueque?',
      respuesta: 'Puedes reportarlo directamente desde su perfil o contactar con nuestro equipo de soporte. Investigamos todos los casos de incumplimiento.'
    },
    {
      pregunta: '¿Cómo puedo eliminar mi publicación?',
      respuesta: 'Ve a tu perfil, selecciona el artículo que deseas eliminar y elige "Eliminar". La acción es inmediata.'
    },
    {
      pregunta: '¿Puedo recuperar mi contraseña?',
      respuesta: 'Sí, en la pantalla de login selecciona "¿Olvidaste tu contraseña?" y sigue las instrucciones enviadas a tu correo.'
    },
    {
      pregunta: '¿Cómo funciona el sistema de reputación?',
      respuesta: 'Cada trueque exitoso suma puntos de reputación. Los usuarios con buena reputación aparecen destacados en la plataforma.'
    }
  ];

  mostrarExplicacion(tema: string) {
    this.temaSeleccionado = tema;

    switch (tema) {
      case 'cuenta':
        this.tituloExplicacion = 'Cómo crear tu cuenta';
        this.textoExplicacion = 'Para crear una cuenta, haz clic en “Registrarse” en la página principal, completa tus datos personales y confirma tu correo electrónico.';
        break;

      case 'trueque':
        this.tituloExplicacion = 'Cómo publicar un trueque';
        this.textoExplicacion = 'Ve a tu perfil, selecciona “Publicar artículo”, sube las imágenes, escribe una descripción y guarda los cambios.';
        break;

      case 'contacto':
        this.tituloExplicacion = 'Cómo contactar a otros usuarios';
        this.textoExplicacion = 'Puedes enviar mensajes directos desde el perfil del usuario o responder a una solicitud de trueque.';
        break;

      case 'seguridad':
        this.tituloExplicacion = 'Consejos de seguridad';
        this.textoExplicacion = 'Evita compartir información personal y realiza los intercambios en lugares seguros. Reporta cualquier comportamiento sospechoso.';
        break;
    }
  }


}
