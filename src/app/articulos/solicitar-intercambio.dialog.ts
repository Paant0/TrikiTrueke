import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { IntercambiosService } from '../Services/intercambios.service';
import { ArticulosService } from '../Services/articulos.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-solicitar-intercambio-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './solicitar-intercambio.dialog.html',
  styleUrls: ['./solicitar-intercambio.dialog.css']
})
export class SolicitarIntercambioDialog {
  mensaje = '';
  isSending = false;
  cargandoMisArticulos = true;
  misArticulos: any[] = [];
  seleccionadoId = '';
  errorLocal = '';

  constructor(
    private dialogRef: MatDialogRef<SolicitarIntercambioDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { articulo: any },
    private intercambiosService: IntercambiosService,
    private articulosService: ArticulosService,
    private authService: AuthService
  ) {
    this.loadMisArticulos();
  }

  get articuloRecibido(): any {
    return this.data.articulo ?? {};
  }

  get articuloRecibidoId(): string {
    return this.extractId(this.articuloRecibido);
  }

  get articuloRecibidoNombre(): string {
    return this.extractNombre(this.articuloRecibido);
  }

  get articuloRecibidoAutorId(): string {
    const autor = this.articuloRecibido?.usuarioId ?? this.articuloRecibido?.usuario ?? null;
    return this.extractId(autor);
  }

  get articuloRecibidoAutorNombre(): string {
    const autor = this.articuloRecibido?.usuarioId ?? this.articuloRecibido?.usuario ?? null;
    return this.extractNombre(autor) || 'Desconocido';
  }

  get usuarioActualId(): string {
    return this.authService.currentUser?.id ?? '';
  }

  get usuarioActualNombre(): string {
    return this.authService.currentUser?.nombre || 'Usuario autenticado';
  }

  get articuloOfrecidoSeleccionado(): any | null {
    return this.misArticulos.find((articulo) => this.extractId(articulo) === this.seleccionadoId) ?? null;
  }

  get articuloOfrecidoNombre(): string {
    return this.extractNombre(this.articuloOfrecidoSeleccionado);
  }

  get puedeEnviar(): boolean {
    return !!this.usuarioActualId
      && !!this.seleccionadoId
      && !!this.articuloRecibidoId
      && this.seleccionadoId !== this.articuloRecibidoId
      && this.usuarioActualId !== this.articuloRecibidoAutorId
      && !this.isSending;
  }

  private loadMisArticulos() {
    this.articulosService.obtenerMisArticulos().subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res) ? res : (res?.data ?? []);
        const articuloRecibidoId = this.articuloRecibidoId;
        this.misArticulos = lista.filter((articulo: any) => this.extractId(articulo) !== articuloRecibidoId);
        this.seleccionadoId = this.misArticulos.length ? this.extractId(this.misArticulos[0]) : '';
        this.cargandoMisArticulos = false;
        this.validarCruceUsuarios();
      },
      error: () => {
        this.misArticulos = [];
        this.cargandoMisArticulos = false;
        this.errorLocal = 'No se pudieron cargar tus artículos para ofrecer.';
      }
    });
  }

  private validarCruceUsuarios() {
    if (!this.usuarioActualId) {
      this.errorLocal = 'Debes iniciar sesión para solicitar un intercambio.';
      return;
    }

    if (this.usuarioActualId === this.articuloRecibidoAutorId) {
      this.errorLocal = 'No puedes solicitar intercambio sobre un artículo publicado por ti mismo.';
      return;
    }

    if (!this.misArticulos.length) {
      this.errorLocal = 'No tienes artículos disponibles para ofrecer en el intercambio.';
    }
  }

  extractId(entity: any): string {
    if (!entity) return '';
    if (typeof entity === 'string') return entity;
    return entity.id ?? entity._id ?? entity.oid ?? entity.codigo ?? '';
  }

  extractNombre(entity: any): string {
    if (!entity) return '';
    if (typeof entity === 'string') return entity;
    return entity.nombre ?? entity.titulo ?? entity.email ?? entity.username ?? '';
  }

  enviar() {
    this.errorLocal = '';

    if (!this.usuarioActualId) {
      this.errorLocal = 'Debes iniciar sesión para solicitar un intercambio.';
      return;
    }

    if (this.usuarioActualId === this.articuloRecibidoAutorId) {
      this.errorLocal = 'No puedes solicitar intercambio sobre tu propio artículo.';
      return;
    }

    if (!this.seleccionadoId) {
      this.errorLocal = 'Selecciona un artículo propio para ofrecer.';
      return;
    }

    if (this.seleccionadoId === this.articuloRecibidoId) {
      this.errorLocal = 'El artículo ofrecido y el recibido deben ser diferentes.';
      return;
    }

    this.isSending = true;

    const payload = {
      articuloOfrecido: this.seleccionadoId,
      articuloRecibido: this.articuloRecibidoId,
      usuarioOfrece: this.usuarioActualId,
      usuarioRecibe: this.articuloRecibidoAutorId,
    };

    this.intercambiosService.crearIntercambio(payload).subscribe({
      next: () => {
        this.isSending = false;
        this.dialogRef.close('ok');
      },
      error: () => {
        this.isSending = false;
        this.errorLocal = 'No se pudo enviar la solicitud. Intenta de nuevo.';
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
