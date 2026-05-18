import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

/**
 * Descripción: Componente que muestra la pantalla de inicio
 * Autor: Hervin Cajas.
 * Fecha de creación: 02/10/2025
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  readonly highlights = [
    {
      icon: 'category',
      title: 'Categorías claras',
      text: 'Explora por grupos con una interfaz más visual y directa.'
    },
    {
      icon: 'sell',
      title: 'Artículos destacados',
      text: 'Encuentra publicaciones con un flujo más limpio y legible.'
    }
  ];

  readonly steps = [
    'Inicia sesión con tu cuenta.',
    'Explora categorías y artículos.',
    'Publica y negocia intercambios.'
  ];

  constructor(private router: Router) { }

  irACategorias(categoria: string) {
    this.router.navigate(['/categorias'], { queryParams: { tipo: categoria } });

  }

}
