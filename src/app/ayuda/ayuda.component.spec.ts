import { Component } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent {
  mostrarExplicacion: string | null = null;

  toggleExplicacion(seccion: string) {
    this.mostrarExplicacion = this.mostrarExplicacion === seccion ? null : seccion;
  }

  cerrarExplicacion() {
    this.mostrarExplicacion = null;
  }
}
