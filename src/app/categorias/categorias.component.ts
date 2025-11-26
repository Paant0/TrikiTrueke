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
    { nombre: 'Mascotas', imagen: 'assets/data/Mascotas.png' },/*ya */
    { nombre: 'Antiguedades', imagen: 'assets/data/antiguedades.png' },/*ya */
    { nombre: 'Moda', imagen: 'assets/data/moda.png' },/*ya */
    { nombre: 'Vehiculos', imagen: 'assets/data/vehiculos.png' },
    { nombre: 'Arte', imagen: 'assets/data/arte.png' },/*ya */
    { nombre: 'Juegos', imagen: 'assets/data/juegos.png' },/*ya */
    { nombre: 'bebes', imagen: 'assets/data/bebes.png' },/*ya */
    { nombre: 'Tecnologia', imagen: 'assets/data/tecnologia.png' },/*ya */
    { nombre: 'belleza', imagen: 'assets/data/belleza.png' },/*ya */
    { nombre: 'Construccion', imagen: 'assets/data/construccion.png' }
  ];
}