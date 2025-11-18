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
    { nombre: 'Mascotas', imagen: 'assets/data/img/mascotas.png' },/*ya */
    { nombre: 'Antiguedades', imagen: 'assets/data/img/antiguedades.jpg' },/*ya */
    { nombre: 'Moda', imagen: 'assets/data/img/moda.png' },/*ya */

    { nombre: 'Vehiculos', imagen: 'assets/data/img/vehiculos.png' },
    { nombre: 'Arte', imagen: 'assets/data/img/arte.png' },/*ya */
    { nombre: 'Juegos', imagen: 'assets/data/img/juegos.png' },/*ya */
    { nombre: 'bebes', imagen: 'assets/data/img/bebes.png' },/*ya */
    { nombre: 'Tecnologia', imagen: 'assets/data/img/tecnologia.jpg' },/*ya */
    { nombre: 'belleza', imagen: 'assets/data/img/belleza.png' },/*ya */
    { nombre: 'Construccion', imagen: 'assets/data/img/construccion.png' }
  ];
}
