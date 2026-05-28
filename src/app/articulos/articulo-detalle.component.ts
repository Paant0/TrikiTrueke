import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ArticulosService } from '../Services/articulos.service';
import { UsuariosService } from '../Services/usuarios.service';
import { SolicitarIntercambioDialog } from './solicitar-intercambio.dialog';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-articulo-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatDialogModule, MatSnackBarModule],
  template: `
    <main class="detalle-page" *ngIf="!loading">
      <mat-card appearance="outlined" *ngIf="articulo; else notFound">
        <div class="detalle-media">
          <img [src]="articulo.imagen ? articulo.imagen : 'assets/placeholder.webp'" [alt]="articulo.nombre" />
        </div>

        <mat-card-content>
          <h2>{{ articulo.nombre }}</h2>
          <p class="autor"><mat-icon>person</mat-icon> {{ articulo.usuarioNombre || articulo.autorNombre || 'Usuario' }}</p>
          <p>{{ articulo.descripcion }}</p>
          <p><strong>Estado:</strong> {{ articulo.estado }}</p>
        </mat-card-content>

        <mat-divider></mat-divider>

        <mat-card-actions>
          <button mat-stroked-button routerLink="/articulos"><mat-icon>arrow_back</mat-icon> Volver</button>
          <button mat-flat-button color="primary" (click)="abrirSolicitud(articulo)"><mat-icon>chat</mat-icon> Solicitar intercambio</button>
        </mat-card-actions>
      </mat-card>

      <ng-template #notFound>
        <mat-card appearance="outlined">
          <mat-card-content>
            <h3>Artículo no encontrado</h3>
            <p>Es posible que el artículo haya sido eliminado o no exista.</p>
            <button mat-button routerLink="/articulos">Volver al listado</button>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </main>

    <div *ngIf="loading" class="loading">Cargando artículo...</div>
  `,
  styles: [`.detalle-page { padding: 16px; }
  .detalle-media img { width:100%; max-width:560px; height:auto; display:block; margin:0 auto 12px; border-radius:6px }
  .autor { color: rgba(0,0,0,0.6); display:flex; gap:8px; align-items:center }
  .loading { padding:24px; text-align:center }`]
})
export class ArticuloDetalleComponent implements OnInit {
  articulo: any = null;
  loading = true;
  private searchToken = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articulosService: ArticulosService,
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/articulos']);
        return;
      }

      this.loadArticulo(id);
    });
  }

  private loadArticulo(id: string): void {
    const token = ++this.searchToken;
    this.loading = true;
    this.articulo = null;

    this.articulosService.obtenerArticulo(id).subscribe({
      next: (data) => {
        if (token !== this.searchToken) return;

        const articulo = data?.data ?? data ?? null;
        if (!articulo) {
          this.loading = false;
          this.snackBar.open('No se pudo cargar el artículo', '', { duration: 3000 });
          this.router.navigate(['/articulos']);
          return;
        }

        this.articulo = articulo;
        console.debug('[ArticuloDetalle] articulo recibido:', articulo);

        if (this.tieneNombreUsuario(articulo)) {
          this.loading = false;
          return;
        }

        const rawUsuarioId = articulo?.usuarioId ?? articulo?.usuario ?? articulo?.usuario?.id ?? null;
        let usuarioId: string | null = null;
        if (rawUsuarioId) {
          if (typeof rawUsuarioId === 'object') {
            usuarioId = rawUsuarioId.id ?? rawUsuarioId._id ?? rawUsuarioId.oid ?? rawUsuarioId.uuid ?? null;
          } else {
            usuarioId = String(rawUsuarioId);
          }
        }

        if (usuarioId) {
          this.usuariosService.obtenerUsuario(String(usuarioId)).subscribe({
            next: (usuario) => {
              if (token !== this.searchToken) return;

              console.debug('[ArticuloDetalle] usuario obtenido por id:', usuario);
              const nombre = usuario?.nombre ?? usuario?.data?.nombre ?? null;
              if (nombre) {
                this.articulo = { ...this.articulo, usuarioNombre: nombre };
              } else {
                this.cargarNombreUsuarioDesdeListado(id, articulo, token);
                return;
              }
              this.loading = false;
            },
            error: () => {
              if (token !== this.searchToken) return;
              this.cargarNombreUsuarioDesdeListado(id, articulo, token);
            }
          });
          return;
        }

        this.cargarNombreUsuarioDesdeListado(id, articulo, token);
      },
      error: () => {
        if (token !== this.searchToken) return;
        this.loading = false;
        this.snackBar.open('No se pudo cargar el artículo', '', { duration: 3000 });
        this.router.navigate(['/articulos']);
      }
    });
  }

  private cargarNombreUsuarioDesdeListado(id: string, articulo: any, token?: number): void {
    this.articulosService.obtenerArticulos().subscribe({
      next: (response) => {
        if (token !== undefined && token !== this.searchToken) return;

        const lista = Array.isArray(response) ? response : (response?.data ?? []);
        const coincidencia = lista.find((item: any) => String(item?.id) === String(id));

        if (coincidencia) {
          this.articulo = { ...articulo, ...coincidencia };
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private tieneNombreUsuario(articulo: any): boolean {
    return Boolean(
      articulo?.usuarioNombre ||
      articulo?.nombreUsuario ||
      articulo?.autorNombre ||
      articulo?.ownerNombre ||
      articulo?.createdByNombre ||
      articulo?.usuario?.nombre ||
      articulo?.autor?.nombre ||
      articulo?.owner?.nombre ||
      articulo?.createdBy?.nombre
    );
  }

  abrirSolicitud(articulo: any) {
    const ref = this.dialog.open(SolicitarIntercambioDialog, { width: '420px', data: { articulo } });
    ref.afterClosed().subscribe(result => {
      if (result === 'ok') this.snackBar.open('Solicitud enviada', '', { duration: 3000 });
    });
  }

}
