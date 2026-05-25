import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ArticulosService } from '../Services/articulos.service';
import { CloudinaryService } from '../Services/cloudinary.service';

@Component({
  selector: 'app-articulo-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatDividerModule],
  templateUrl: './articulo-edit-dialog.component.html',
  styleUrls: ['./articulo-edit-dialog.component.css']
})
export class ArticuloEditDialogComponent {
  articulo: any;
  private usuarioIdOriginal: any = null;
  private usuarioIdActual: string | null = null;
  categoriasDisponibles: any[] = [];
  imagenPreview: string | ArrayBuffer | null = null;
  isUploading = false;
  uploadError = '';

  constructor(
    private dialogRef: MatDialogRef<ArticuloEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private articulosService: ArticulosService,
    private cloudinaryService: CloudinaryService
  ) {
    this.articulo = { ...data };
    this.categoriasDisponibles = (Array.isArray(data?.categorias) ? data.categorias : []).map((categoria: any) => ({
      ...categoria,
      id: String(categoria?.id ?? categoria?._id ?? categoria?.oid ?? '').trim()
    }));
    this.articulo.categoriaId = this.resolverCategoriaId(this.articulo);
    this.usuarioIdActual = this.extraerId(data?.usuarioIdActual ?? null);
    this.usuarioIdOriginal = this.extraerId(this.articulo?.usuarioId ?? this.articulo?.usuario?.id ?? null) ?? this.usuarioIdActual;
    this.imagenPreview = this.articulo?.imagen ?? null;
  }

  private extraerId(valor: any): string | null {
    if (valor === null || valor === undefined) return null;
    if (typeof valor === 'string') return valor.trim();
    if (typeof valor === 'number') return String(valor);
    if (typeof valor === 'object') {
      if (valor.$oid) return String(valor.$oid).trim();
      if (valor.oid) return String(valor.oid).trim();
      if (valor._id) return String(valor._id).trim();
      if (valor.id) return String(valor.id).trim();
      try {
        const texto = valor.toString();
        if (texto && texto !== '[object Object]') {
          return texto.trim();
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  private resolverCategoriaId(articulo: any): any {
    const candidatoDirecto = articulo?.categoriaId ?? articulo?.categoria?.id ?? null;
    if (candidatoDirecto) {
      return String(candidatoDirecto).trim();
    }

    const categoriaTexto = String(articulo?.categoria || '').trim().toLowerCase();
    if (!categoriaTexto) {
      return '';
    }

    const coincidencia = this.categoriasDisponibles.find((categoria: any) => {
      const nombre = String(categoria?.nombre || '').trim().toLowerCase();
      const id = String(categoria?.id || '').trim().toLowerCase();
      return nombre === categoriaTexto || id === categoriaTexto;
    });

    return String(coincidencia?.id ?? articulo?.categoria ?? '').trim();
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.imagenPreview = reader.result; };
    reader.readAsDataURL(file);
    this.isUploading = true; this.uploadError = '';
    this.cloudinaryService.uploadImage(file).subscribe({
      next: (url) => { this.articulo.imagen = url; this.imagenPreview = url; this.isUploading = false; },
      error: (err) => { console.error(err); this.uploadError = 'Error al subir imagen'; this.isUploading = false; }
    });
  }

  save() {
    const payload = {
      id: this.articulo.id,
      nombre: this.articulo.nombre,
      descripcion: this.articulo.descripcion,
      imagen: this.articulo.imagen,
      estado: this.articulo.estado,
      categoriaId: this.articulo.categoriaId ?? this.resolverCategoriaId(this.articulo),
      usuarioId: this.usuarioIdOriginal ?? this.usuarioIdActual ?? this.extraerId(this.articulo?.usuarioId)
    };

    this.articulosService.editarArticulo(this.articulo.id, payload).subscribe({
      next: () => this.dialogRef.close({ status: 'saved', articulo: { ...payload } }),
      error: (err) => { console.error(err); this.uploadError = 'No se pudo guardar'; }
    });
  }

  cancel() {
    this.dialogRef.close({ status: 'cancel' });
  }
}
