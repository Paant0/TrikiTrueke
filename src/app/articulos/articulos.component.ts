import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import articulosData from '../../assets/data/articulos.json';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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

  mostrarFormulario: boolean = false;
  imagenPreview: string | ArrayBuffer | null = null;
  readonly categoriasDisponibles = ['Antiguedades', 'Arte', 'Bebes', 'Belleza', 'Camaras', 'Construccion', 'Deportes', 'Juegos', 'Mascotas', 'Moda', 'Tecnologia', 'Vehiculos'];

  // FORM PUBLICAR
  nuevoArticulo = {
    nombre: '',
    descripcion: '',
    categoria: '',
    motivo: '',
    imagen: ''
  };

  // FORM EDITAR
  editando: boolean = false;
  articuloEditado: any = null;
  imagenEditPreview: string | ArrayBuffer | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const lista = Array.isArray(articulosData) ? articulosData : [];

    this.route.paramMap.subscribe(params => {
      this.categoria = (params.get('categoria') || '').trim();

      if (this.categoria) {
        this.articulosFiltrados = lista.filter(a =>
          String(a.categoria || '').toLowerCase() === this.categoria.toLowerCase()
        );
      } else {
        this.articulosFiltrados = lista;
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result;
      this.nuevoArticulo.imagen = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  publicarArticulo() {
    if (!this.nuevoArticulo.nombre || !this.nuevoArticulo.descripcion || !this.nuevoArticulo.categoria) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    this.articulosFiltrados.push({ ...this.nuevoArticulo });

    this.nuevoArticulo = {
      nombre: '',
      descripcion: '',
      categoria: '',
      motivo: '',
      imagen: ''
    };
    this.imagenPreview = null;
    this.mostrarFormulario = false;
  }

  editarArticulo(articulo: any) {
    this.editando = true;
    this.articuloEditado = articulo;
    this.imagenEditPreview = articulo.imagen;
  }

  onEditImageSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenEditPreview = reader.result;
      this.articuloEditado.imagen = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  guardarCambios() {
    this.editando = false;
    this.articuloEditado = null;
    this.imagenEditPreview = null;
  }

  cancelarEdicion() {
    this.editando = false;
    this.articuloEditado = null;
    this.imagenEditPreview = null;
  }

  eliminarArticulo(articulo: any) {
    if (confirm("¿Seguro que deseas eliminar este artículo?")) {
      this.articulosFiltrados = this.articulosFiltrados.filter(a => a !== articulo);
    }
  }

}
