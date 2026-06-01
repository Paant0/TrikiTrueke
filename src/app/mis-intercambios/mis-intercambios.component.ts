import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, UsuarioDTO } from '../Services/auth.service';
import { ArticulosService } from '../Services/articulos.service';
import { IntercambiosService } from '../Services/intercambios.service';
import { UsuariosService } from '../Services/usuarios.service';

type IntercambioEstado = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'CANCELADO' | string;

interface IntercambioViewModel {
  id: string;
  estado: IntercambioEstado;
  creadoEn: string | null;
  esRecibido: boolean;
  esEnviado: boolean;
  puedeAceptar: boolean;
  puedeRechazar: boolean;
  puedeCancelar: boolean;
  articuloOfrecidoId: string;
  articuloRecibidoId: string;
  usuarioOfreceId: string;
  usuarioRecibeId: string;
  articuloOfrecidoNombre: string;
  articuloRecibidoNombre: string;
  contraparteNombre: string;
}

@Component({
  selector: 'app-mis-intercambios',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mis-intercambios.component.html',
  styleUrls: ['./mis-intercambios.component.css']
})
export class MisIntercambiosComponent implements OnInit {
  usuario: UsuarioDTO | null = null;
  cargando = true;
  error = '';
  intercambiosRecibidos: IntercambioViewModel[] = [];
  intercambiosEnviados: IntercambioViewModel[] = [];

  private articulosPorId = new Map<string, any>();
  private nombresUsuarios = new Map<string, string>();

  constructor(
    private authService: AuthService,
    private articulosService: ArticulosService,
    private intercambiosService: IntercambiosService,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.usuario = this.obtenerUsuarioActual();

    if (!this.usuario && isPlatformBrowser(this.platformId)) {
      this.authService.getMe().subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          this.cargarDatos();
        },
        error: () => this.cargarDatos(),
      });
      return;
    }

    this.cargarDatos();
  }

  recargar(): void {
    this.cargarDatos();
  }

  irAArticulos(): void {
    this.router.navigate(['/articulos']);
  }

  aceptar(intercambio: IntercambioViewModel): void {
    this.intercambiosService.aceptarIntercambio(intercambio.id).subscribe({
      next: () => {
        this.snackBar.open('Intercambio aceptado', '', { duration: 2500 });
        this.recargar();
      },
      error: () => this.snackBar.open('No se pudo aceptar el intercambio', '', { duration: 3000 }),
    });
  }

  rechazar(intercambio: IntercambioViewModel): void {
    this.intercambiosService.rechazarIntercambio(intercambio.id).subscribe({
      next: () => {
        this.snackBar.open('Intercambio rechazado', '', { duration: 2500 });
        this.recargar();
      },
      error: () => this.snackBar.open('No se pudo rechazar el intercambio', '', { duration: 3000 }),
    });
  }

  cancelar(intercambio: IntercambioViewModel): void {
    this.intercambiosService.cancelarIntercambio(intercambio.id).subscribe({
      next: () => {
        this.snackBar.open('Intercambio cancelado', '', { duration: 2500 });
        this.recargar();
      },
      error: () => this.snackBar.open('No se pudo cancelar el intercambio', '', { duration: 3000 }),
    });
  }

  get totalRecibidos(): number {
    return this.intercambiosRecibidos.length;
  }

  get totalEnviados(): number {
    return this.intercambiosEnviados.length;
  }

  get totalPendientes(): number {
    return [...this.intercambiosRecibidos, ...this.intercambiosEnviados].filter(item => this.esPendiente(item.estado)).length;
  }

  get primerNombre(): string {
    const fullNombre = this.usuario?.nombre || 'Usuario';
    return fullNombre.split(' ')[0];
  }

  get cantidadAccionables(): number {
    return this.intercambiosRecibidos.filter(item => item.puedeAceptar || item.puedeRechazar).length;
  }

  get sesionDisponible(): boolean {
    return Boolean(this.usuario);
  }

  estadoEtiqueta(estado: IntercambioEstado): string {
    const normalizado = String(estado || '').toUpperCase();
    if (normalizado === 'PENDIENTE') return 'Pendiente';
    if (normalizado === 'ACEPTADO') return 'Aceptado';
    if (normalizado === 'RECHAZADO') return 'Rechazado';
    if (normalizado === 'CANCELADO') return 'Cancelado';
    return estado || 'Sin estado';
  }

  private cargarDatos(): void {
    this.cargando = true;
    this.error = '';

    forkJoin({
      articulos: this.cargarArticulos(),
      intercambios: this.cargarIntercambios(),
    }).subscribe({
      next: ({ articulos, intercambios }) => {
        this.articulosPorId = this.indexarArticulos(articulos);

        const baseList = intercambios
          .map((item: any) => this.normalizarIntercambioBase(item))
          .filter((item: NormalizedIntercambio | null): item is NormalizedIntercambio => Boolean(item));

        this.precargarNombresUsuarios(baseList).subscribe({
          next: () => {
            const vmList = baseList
              .map((item: NormalizedIntercambio) => this.aViewModel(item))
              .filter((item: IntercambioViewModel | null): item is IntercambioViewModel => Boolean(item));

            this.intercambiosRecibidos = vmList.filter((item: IntercambioViewModel) => item.esRecibido);
            this.intercambiosEnviados = vmList.filter((item: IntercambioViewModel) => item.esEnviado);
            this.cargando = false;
          },
          error: () => {
            this.error = 'No se pudieron cargar tus intercambios.';
            this.cargando = false;
          }
        });
      },
      error: () => {
        this.error = 'No se pudieron cargar tus intercambios.';
        this.cargando = false;
      }
    });
  }

  private cargarArticulos() {
    return this.articulosService.obtenerArticulos().pipe(
      map((response: any) => Array.isArray(response) ? response : (response?.data ?? [])),
      catchError(() => of([]))
    );
  }

  private cargarIntercambios() {
    return this.intercambiosService.obtenerMisIntercambios().pipe(
      map((response: any) => Array.isArray(response) ? response : (response?.data ?? [])),
      catchError(() => of([]))
    );
  }

  private precargarNombresUsuarios(intercambios: NormalizedIntercambio[]) {
    const ids = Array.from(new Set(intercambios.map(item => item.contraparteId).filter(Boolean)))
      .filter(id => !this.nombresUsuarios.has(id));

    if (ids.length === 0) {
      return of(null);
    }

    return forkJoin(
      ids.map((id) =>
        this.usuariosService.obtenerUsuario(id).pipe(
          map((usuario: any) => ({ id, nombre: usuario?.nombre ?? usuario?.data?.nombre ?? 'Usuario' })),
          catchError(() => of({ id, nombre: 'Usuario' }))
        )
      )
    ).pipe(
      map((resultados) => {
        resultados.forEach(({ id, nombre }) => this.nombresUsuarios.set(id, nombre || 'Usuario'));
        return null;
      })
    );
  }

  private normalizarIntercambioBase(intercambio: any): NormalizedIntercambio | null {
    if (!intercambio) return null;

    const usuarioIdActual = this.obtenerIdUsuarioActual();
    if (!usuarioIdActual) return null;

    const articuloOfrecidoId = this.extraerId(intercambio?.articuloOfrecido);
    const articuloRecibidoId = this.extraerId(intercambio?.articuloRecibido);
    const usuarioOfreceId = this.extraerId(intercambio?.usuarioOfrece);
    const usuarioRecibeId = this.extraerId(intercambio?.usuarioRecibe);
    const estado = String(intercambio?.estado || '').toUpperCase();
    const esRecibido = usuarioRecibeId === usuarioIdActual;
    const esEnviado = usuarioOfreceId === usuarioIdActual;

    if (!esRecibido && !esEnviado) return null;

    return {
      id: this.extraerId(intercambio?.id),
      estado,
      creadoEn: intercambio?.creadoEn ?? null,
      esRecibido,
      esEnviado,
      puedeAceptar: esRecibido && estado === 'PENDIENTE',
      puedeRechazar: esRecibido && estado === 'PENDIENTE',
      puedeCancelar: esEnviado && estado === 'PENDIENTE',
      articuloOfrecidoId,
      articuloRecibidoId,
      usuarioOfreceId,
      usuarioRecibeId,
      contraparteId: esRecibido ? usuarioOfreceId : usuarioRecibeId,
    };
  }

  private aViewModel(intercambio: NormalizedIntercambio): IntercambioViewModel | null {
    if (!intercambio.id) return null;

    const contraparteNombre = intercambio.contraparteId === this.obtenerIdUsuarioActual()
      ? this.primerNombre
      : (this.nombresUsuarios.get(intercambio.contraparteId) || 'Usuario');

    return {
      id: intercambio.id,
      estado: intercambio.estado,
      creadoEn: intercambio.creadoEn,
      esRecibido: intercambio.esRecibido,
      esEnviado: intercambio.esEnviado,
      puedeAceptar: intercambio.puedeAceptar,
      puedeRechazar: intercambio.puedeRechazar,
      puedeCancelar: intercambio.puedeCancelar,
      articuloOfrecidoId: intercambio.articuloOfrecidoId,
      articuloRecibidoId: intercambio.articuloRecibidoId,
      usuarioOfreceId: intercambio.usuarioOfreceId,
      usuarioRecibeId: intercambio.usuarioRecibeId,
      articuloOfrecidoNombre: this.obtenerNombreArticulo(intercambio.articuloOfrecidoId),
      articuloRecibidoNombre: this.obtenerNombreArticulo(intercambio.articuloRecibidoId),
      contraparteNombre,
    };
  }

  private obtenerUsuarioActual(): UsuarioDTO | null {
    if (!isPlatformBrowser(this.platformId)) return this.authService.currentUser;

    const guardado = localStorage.getItem('usuario');
    if (guardado) {
      try {
        return JSON.parse(guardado) as UsuarioDTO;
      } catch {
        return this.authService.currentUser;
      }
    }

    return this.authService.currentUser;
  }

  private obtenerIdUsuarioActual(): string {
    return String(this.usuario?.id ?? this.authService.currentUser?.id ?? '').trim();
  }

  private obtenerNombreArticulo(id: string): string {
    if (!id) return 'Artículo no disponible';
    const articulo = this.articulosPorId.get(id);
    return articulo?.nombre || articulo?.titulo || 'Artículo no disponible';
  }

  private indexarArticulos(articulos: any[]): Map<string, any> {
    const mapa = new Map<string, any>();

    for (const articulo of articulos || []) {
      const id = this.extraerId(articulo?.id);
      if (id) {
        mapa.set(id, articulo);
      }
    }

    return mapa;
  }

  private extraerId(valor: any): string {
    if (valor === null || valor === undefined) return '';
    if (typeof valor === 'string' || typeof valor === 'number') return String(valor).trim();
    if (typeof valor === 'object') {
      return String(valor.id ?? valor._id ?? valor.oid ?? valor.uuid ?? '').trim();
    }
    return '';
  }

  private esPendiente(estado: IntercambioEstado): boolean {
    return String(estado || '').toUpperCase() === 'PENDIENTE';
  }
}

interface NormalizedIntercambio {
  id: string;
  estado: IntercambioEstado;
  creadoEn: string | null;
  esRecibido: boolean;
  esEnviado: boolean;
  puedeAceptar: boolean;
  puedeRechazar: boolean;
  puedeCancelar: boolean;
  articuloOfrecidoId: string;
  articuloRecibidoId: string;
  usuarioOfreceId: string;
  usuarioRecibeId: string;
  contraparteId: string;
}