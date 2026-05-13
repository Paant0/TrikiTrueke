import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriasService } from '../Services/categorias.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {

  categorias: any[] = [];

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit(): void {

    this.categoriasService.obtenerCategorias().subscribe({

      next: (response) => {
        console.log(response);
        this.categorias = Array.isArray(response) ? response : (response?.data ?? []);
      },

      error: (error) => {
        console.log(error);
      }

    });

  }
}