import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayuda',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent {
  temaSeleccionado: string | null = null;
  tituloExplicacion = '';
  textoExplicacion = '';

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

  cerrarExplicacion() {
    this.temaSeleccionado = null;
  }
}
