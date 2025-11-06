import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent {

  temaSeleccionado: string | null = null;
  tituloExplicacion: string = '';
  textoExplicacion: string = '';

  explicaciones: any = {
    cuenta: {
      titulo: 'Crear mi cuenta',
      texto: 'Aprende cómo registrarte e iniciar sesión fácilmente.'
    },
    trueque: {
      titulo: 'Publicar un trueque',
      texto: 'Guía paso a paso para subir tus artículos.'
    },
    contacto: {
      titulo: 'Contactar usuarios',
      texto: 'Descubre cómo comunicarte con otros truekers.'
    },
    seguridad: {
      titulo: 'Seguridad',
      texto: 'Consejos para realizar intercambios de forma segura.'
    }
  };

  mostrarExplicacion(tema: string) {
    this.temaSeleccionado = tema;
    this.tituloExplicacion = this.explicaciones[tema].titulo;
    this.textoExplicacion = this.explicaciones[tema].texto;
  }

  cerrarExplicacion() {
    this.temaSeleccionado = null;
  }
}
