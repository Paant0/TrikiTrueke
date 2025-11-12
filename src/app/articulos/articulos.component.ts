import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import articulosData from '../../assets/data/articulos.json'; // <- Ajusta ../ según la ubicación real

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {
  categoria = '';
  articulosFiltrados: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // DEBUG: ver en consola que el JSON se importó
    // console.log('articulosData', articulosData);

    this.route.paramMap.subscribe(params => {
      this.categoria = (params.get('categoria') || '').trim();
      if (this.categoria) {
        // defensivo: comprueba que articulosData es un array
        const lista = Array.isArray(articulosData) ? articulosData : [];
        this.articulosFiltrados = lista.filter(a =>
          String(a.categoria || '').toLowerCase() === this.categoria.toLowerCase()
        );
      } else {
        // si no hay categoria, muestra todo o vacío según prefieras
        this.articulosFiltrados = Array.isArray(articulosData) ? articulosData : [];
      }
    });
  }
}
