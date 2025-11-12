import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * Descripción: Componente que muestra las categorias de los productos
 * Autor: Kevin Acosta.
 * Fecha de creación: 02/10/2025
 */

@Component({
  selector: 'app-categorias',
  imports: [RouterOutlet,CommonModule, RouterLink],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {
 categorias = [
    { nombre: 'Mascotas', imagen: 'assets/img/categorias/mascotas.jpg' },
    { nombre: 'Consolas', imagen: 'assets/img/categorias/consolas.jpg' },
    { nombre: 'Televisores', imagen: 'assets/img/categorias/televisores.jpg' },
    { nombre: 'Controles', imagen: 'assets/img/categorias/controles.jpg' },
    { nombre: 'Motos', imagen: 'assets/img/categorias/motos.jpg' },
    { nombre: 'Carros', imagen: 'assets/img/categorias/carros.jpg' },
    { nombre: 'Licuadoras', imagen: 'assets/img/categorias/licuadoras.jpg' },
    { nombre: 'Niños', imagen: 'assets/img/categorias/niños.jpg' },
    { nombre: 'IoT', imagen: 'assets/img/categorias/iot.jpg' },
    { nombre: 'Drones', imagen: 'assets/img/categorias/drones.jpg' },
    { nombre: 'Parcelas', imagen: 'assets/img/categorias/parcelas.jpg' }
  ];
}
