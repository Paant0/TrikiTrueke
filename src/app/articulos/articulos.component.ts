import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import articulosData from '../../assets/data/articulos.json';

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {

  categoria = '';
  articulosFiltrados: any[] = [];

  mostrarFormulario: boolean = false;
  imagenPreview: string | ArrayBuffer | null = null;

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

  // 📌 Imagen al publicar
  onImageSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result;
      this.nuevoArticulo.imagen = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 📌 Publicar
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

  // 📌 EDITAR — abrir formulario
  editarArticulo(articulo: any) {
    this.editando = true;
    this.articuloEditado = articulo;
    this.imagenEditPreview = articulo.imagen;
  }

  // 📌 Imagen durante edición
  onEditImageSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenEditPreview = reader.result;
      this.articuloEditado.imagen = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 📌 Guardar cambios
  guardarCambios() {
    this.editando = false;
    this.articuloEditado = null;
    this.imagenEditPreview = null;
  }

  // 📌 Cancelar edición
  cancelarEdicion() {
    this.editando = false;
    this.articuloEditado = null;
    this.imagenEditPreview = null;
  }

  // 📌 Eliminar artículo
  eliminarArticulo(articulo: any) {
    if (confirm("¿Seguro que deseas eliminar este artículo?")) {
      this.articulosFiltrados = this.articulosFiltrados.filter(a => a !== articulo);
    }
  }

}
