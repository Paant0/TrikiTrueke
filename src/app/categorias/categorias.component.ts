import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CategoriasService } from '../Services/categorias.service';

@Component({
  selector: 'app-categorias',
  imports: [RouterOutlet, CommonModule, RouterLink],
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
        this.categorias = response;
      },

      error: (error) => {
        console.log(error);
      }

    });

  }
}