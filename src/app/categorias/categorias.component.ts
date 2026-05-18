import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriasService } from '../Services/categorias.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: any[] = [];

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit(): void {

    this.categoriasService.obtenerCategorias().subscribe({

      next: (response) => {
        this.categorias = Array.isArray(response) ? response : (response?.data ?? []);
        console.info('[CategoriasComponent] Categorías cargadas', {
          total: this.categorias.length,
          origen: Array.isArray(response) ? 'array' : 'response.data'
        });
      },

      error: (error) => {
        console.error('[CategoriasComponent] Falló la carga de categorías', {
          status: error?.status,
          statusText: error?.statusText,
          url: error?.url,
          message: error?.message,
          error: error?.error
        });
      }

    });

  }
}