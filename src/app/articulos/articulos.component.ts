import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ArticulosService } from '../Services/articulos.service';
import { CategoriasService } from '../Services/categorias.service';
import { CloudinaryService } from '../Services/cloudinary.service';

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})

export class ArticulosComponent implements OnInit {

  categoria = '';
  articulosFiltrados: any[] = [];
  mostrarFormulario = false;
  imagenPreview: string | ArrayBuffer | null = null;
  categoriasDisponibles: any[] = [];
  isUploadingImage = false;
  uploadError = '';

  nuevoArticulo = {
    nombre: '',
    descripcion: '',
    categoriaId: '',
    motivo: '',
    imagen: ''
  };

  constructor(
    private route: ActivatedRoute,
    private articulosService: ArticulosService,
    private categoriasService: CategoriasService,
    private cloudinaryService: CloudinaryService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoria = (params.get('categoria') || '').trim();
      this.cargarArticulos();
      this.cargarCategorias();
    });
  }

  cargarArticulos() {
    this.articulosService.obtenerArticulos().subscribe({
      next: (response) => {
        const lista = Array.isArray(response) ? response : (response?.data ?? []);
        if (this.categoria) {
          this.articulosFiltrados = lista.filter((a: any) => String(a.categoria || '').toLowerCase() === this.categoria.toLowerCase());
        } else {
          this.articulosFiltrados = lista;
        }
      },
      error: () => { }
    });
  }

  onImageSelected(event: any) {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => { this.imagenPreview = reader.result; };
    reader.readAsDataURL(file);

    this.isUploadingImage = true;
    this.uploadError = '';

    this.cloudinaryService.uploadImage(file).subscribe({
      next: (imageUrl) => {
        this.nuevoArticulo.imagen = imageUrl;
        this.imagenPreview = imageUrl;
        this.isUploadingImage = false;
      },
      error: () => { this.uploadError = 'No se pudo subir la imagen. Intenta de nuevo.'; this.isUploadingImage = false; }
    });
  }

  publicarArticulo() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const articulo: any = {
      nombre: this.nuevoArticulo.nombre,
      descripcion: this.nuevoArticulo.descripcion,
      usuarioId: usuario.id,
      categoriaId: this.nuevoArticulo.categoriaId,
      imagen: this.nuevoArticulo.imagen,
      estado: 'DISPONIBLE'
    };

    this.articulosService.crearArticulo(articulo).subscribe({
      next: () => {
        alert('Artículo publicado');
        this.cargarArticulos();
        this.mostrarFormulario = false;
        this.nuevoArticulo = { nombre: '', descripcion: '', categoriaId: '', motivo: '', imagen: '' };
        this.imagenPreview = null;
      },
      error: () => { alert('Error al publicar'); }
    });
  }

  eliminarArticulo(articulo: any) {
    if (!confirm('¿Seguro que deseas eliminar este artículo?')) return;
    this.articulosService.eliminarArticulo(articulo.id).subscribe({
      next: () => { alert('Artículo eliminado'); this.cargarArticulos(); },
      error: () => { alert('Error al eliminar'); }
    });
  }

  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (response) => {
        const lista = Array.isArray(response) ? response : (response?.data ?? []);
        this.categoriasDisponibles = lista.map((categoria: any) => ({
          ...categoria,
          id: categoria?.id ?? categoria?._id ?? categoria?.oid ?? categoria?.codigo ?? ''
        }));
      },
      error: () => { this.categoriasDisponibles = []; }
    });
  }

}
