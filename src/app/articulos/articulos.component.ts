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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SolicitarIntercambioDialog } from './solicitar-intercambio.dialog';
import { ArticulosService } from '../Services/articulos.service';
import { CategoriasService } from '../Services/categorias.service';
import { CloudinaryService } from '../Services/cloudinary.service';
import { UsuariosService } from '../Services/usuarios.service';

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
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
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
  nombresUsuarios: Record<string, string> = {};

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
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
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
        console.debug('[ArticulosComponent] obtenerArticulos response:', response);
        const lista = Array.isArray(response) ? response : (response?.data ?? []);
        if (Array.isArray(lista) && lista.length > 0) {
          console.debug('[ArticulosComponent] primer articulo ejemplo:', lista[0]);
        }
        if (this.categoria) {
          this.articulosFiltrados = lista.filter((a: any) => String(a.categoria || '').toLowerCase() === this.categoria.toLowerCase());
        } else {
          this.articulosFiltrados = lista;
        }

        this.precargarNombresUsuarios(this.articulosFiltrados);
      },
      error: () => { }
    });
  }

  obtenerNombreUsuario(articulo: any): string {
    const nombreNormalizado = articulo?.usuarioNombre ?? articulo?.nombreUsuario ?? articulo?.autorNombre ?? articulo?.ownerNombre ?? articulo?.createdByNombre;

    if (nombreNormalizado) return String(nombreNormalizado).trim();

    const usuarioId = this.extraerIdUsuario(articulo?.usuarioId ?? articulo?.usuario ?? articulo?.autor ?? articulo?.owner ?? articulo?.createdBy);
    if (usuarioId && this.nombresUsuarios[usuarioId]) {
      return this.nombresUsuarios[usuarioId];
    }

    return 'Usuario';
  }

  private extraerNombreUsuario(valor: any): string {
    if (!valor) return '';
    if (typeof valor === 'string') return valor;
    if (typeof valor === 'object') {
      return valor.nombre
        || valor.nombreCompleto
        || valor.fullName
        || valor.name
        || valor.username
        || valor.email
        || '';
    }

    return '';
  }

  private extraerIdUsuario(valor: any): string {
    if (!valor) return '';
    if (typeof valor === 'string' || typeof valor === 'number') return String(valor).trim();
    if (typeof valor === 'object') {
      const posible = valor.id ?? valor._id ?? valor.oid ?? valor.uuid ?? '';
      return String(posible).trim();
    }
    return '';
  }

  private precargarNombresUsuarios(articulos: any[]): void {
    const ids = Array.from(
      new Set(
        articulos
          .map((articulo: any) => this.extraerIdUsuario(articulo?.usuarioId ?? articulo?.usuario ?? articulo?.autor ?? articulo?.owner ?? articulo?.createdBy))
          .filter((id: string) => !!id && !this.nombresUsuarios[id])
      )
    );

    if (ids.length === 0) {
      return;
    }

    forkJoin(
      ids.map((id) =>
        this.usuariosService.obtenerUsuario(id).pipe(
          map((usuario: any) => ({ id, nombre: usuario?.nombre ?? usuario?.data?.nombre ?? '' })),
          catchError(() => of({ id, nombre: '' }))
        )
      )
    ).subscribe((resultados) => {
      resultados.forEach(({ id, nombre }) => {
        if (nombre) {
          this.nombresUsuarios[id] = nombre;
        }
      });
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

  abrirSolicitud(articulo: any) {
    const ref = this.dialog.open(SolicitarIntercambioDialog, {
      width: '420px',
      data: { articulo }
    });

    ref.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.snackBar.open('Solicitud enviada', '', { duration: 3000 });
      }
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
