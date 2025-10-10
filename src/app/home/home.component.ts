import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Descripción: Componente que muestra la pantalla de inicio
 * Autor: Hervin Cajas.
 * Fecha de creación: 02/10/2025
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
