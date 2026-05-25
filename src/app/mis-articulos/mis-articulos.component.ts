import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ArticulosService } from '../Services/articulos.service';
import { CategoriasService } from '../Services/categorias.service';
import { AuthService, UsuarioDTO } from '../Services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-mis-articulos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './mis-articulos.component.html',
  styleUrls: ['./mis-articulos.component.css']
})
export class MisArticulosComponent implements OnInit {
  usuario: UsuarioDTO | null = null;
  misArticulos: any[] = [];
  cargando = true;
  error = '';

  categoriasDisponibles: any[] = [];

  constructor(
    private articulosService: ArticulosService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object,
    private dialog: MatDialog,
    private categoriasService: CategoriasService,
  ) {}

  async editarArticulo(articulo: any) {
    const module = await import('../articulo-edit-dialog/articulo-edit-dialog.component');
    const dialogRef = this.dialog.open(module.ArticuloEditDialogComponent as any, {
      width: 'min(95vw, 980px)',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        ...articulo,
        categorias: this.categoriasDisponibles,
        usuarioIdActual: this.obtenerIdUsuarioActual()
      }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result?.status === 'saved') {
        const articuloActualizado = result.articulo;
        if (articuloActualizado?.id) {
          this.misArticulos = this.misArticulos.map(item =>
            item.id === articuloActualizado.id
              ? { ...item, ...articuloActualizado, usuarioId: item.usuarioId }
              : item
          );
        } else {
          this.cargarMisArticulos();
        }
      }
    });
  }

  ngOnInit(): void {
    this.usuario = this.obtenerUsuarioActual();

    if (!this.usuario && isPlatformBrowser(this.platformId)) {
      // usuario no encontrado en localStorage; intentar backend
      this.authService.getMe().subscribe({
        next: (u) => {
          this.usuario = u;
          // usuario obtenido desde backend
          this.cargarMisArticulos();
        },
        error: (err) => {
          // getMe falló o no hay sesión activa
          // Aún intentamos cargar artículos (se filtrarán a vacío si no hay usuario)
          this.cargarMisArticulos();
        }
      });
    } else {
      this.cargarMisArticulos();
    }
    // cargar categorías para el editor
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (data) => {
        const lista = Array.isArray(data) ? data : (data?.data ?? []);
        this.categoriasDisponibles = lista;
      },
      error: (err) => {
        // no se pudieron cargar categorías
        this.categoriasDisponibles = [];
      }
    });
  }

  get totalArticulos(): number {
    return this.misArticulos.length;
  }

  get articulosDisponibles(): number {
    return this.contarPorEstado('disponible');
  }

  get articulosEnEspera(): number {
    return this.contarPorEstado('en espera');
  }

  get articulosIntercambiados(): number {
    return this.contarPorEstado('intercambiado');
  }

  cargarMisArticulos(): void {
    this.cargando = true;
    this.error = '';
    this.articulosService.obtenerMisArticulos().subscribe({
      next: (data) => {
        const lista = this.normalizarListaArticulos(data);

        if (lista.length > 0) {
          this.misArticulos = lista;
          this.cargando = false;
          return;
        }

        this.cargarMisArticulosDesdeCatalogo();
      },
      error: (err) => {
        this.cargarMisArticulosDesdeCatalogo(err?.error?.message ?? 'No se pudieron cargar tus artículos.');
      }
    });
  }

  private cargarMisArticulosDesdeCatalogo(mensajeError?: string): void {
    this.articulosService.obtenerArticulos().subscribe({
      next: (data) => {
        const lista = this.normalizarListaArticulos(data);
        this.misArticulos = this.usuario
          ? lista.filter(articulo => this.perteneceAlUsuario(articulo))
          : lista;
        this.error = '';
        this.cargando = false;
      },
      error: () => {
        this.error = mensajeError ?? 'No se pudieron cargar tus artículos.';
        this.misArticulos = [];
        this.cargando = false;
      }
    });
  }

  eliminarArticulo(articulo: any): void {
    const confirmado = confirm(`¿Eliminar "${articulo?.nombre || 'este artículo'}"?`);
    if (!confirmado) {
      return;
    }

    this.articulosService.eliminarArticulo(articulo.id).subscribe({
      next: () => {
        this.misArticulos = this.misArticulos.filter(item => item.id !== articulo.id);
      },
      error: (err) => { alert('No se pudo eliminar el artículo. Intenta de nuevo.'); }
    });
  }

  private obtenerUsuarioActual(): UsuarioDTO | null {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        try {
          return JSON.parse(usuarioGuardado) as UsuarioDTO;
        } catch {
          // Ignorar y usar el estado en memoria si existe.
        }
      }
    }

    return this.authService.currentUser;
  }

  private obtenerIdUsuarioActual(): string | null {
    const usuario = this.obtenerUsuarioActual();
    const valor = usuario?.id ?? this.authService.currentUser?.id ?? null;
    return valor ? String(valor).trim() : null;
  }

  private perteneceAlUsuario(articulo: any): boolean {
    const usuarioId = this.usuario?.id?.toString().trim();
    if (!usuarioId) {
      return false;
    }
    const candidatosRaw = [
      articulo?.usuarioId,
      articulo?.usuario?.id,
      articulo?.autorId,
      articulo?.userId,
      articulo?._id,
      articulo?.ownerId,
      articulo?.creatorId,
      articulo?.createdBy
    ];

    const extractId = (v: any): string | null => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'string') return v.trim();
      if (typeof v === 'number') return String(v);
      if (typeof v === 'object') {
        if (v.$oid) return String(v.$oid).trim();
        if (v.oid) return String(v.oid).trim();
        if (v._id) return String(v._id).trim();
        if (v.id) return String(v.id).trim();
        try {
          const s = v.toString();
          if (s && s !== '[object Object]') return s.trim();
        } catch { /* ignore */ }
        return null;
      }
      return null;
    };

    const candidatosExtraidos = candidatosRaw
      .map((valor: any) => ({ raw: valor, id: extractId(valor) }))
      .filter((x: any) => x.id)
      .map((x: any) => x.id as string);

    const normalize = (s: string) => String(s || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const usNorm = normalize(usuarioId);

    // Exact match first
    if (candidatosExtraidos.includes(usuarioId)) { return true; }

    // Normalized exact match
    const candidatosNorm = candidatosExtraidos.map(c => normalize(c));
    if (candidatosNorm.includes(usNorm)) { return true; }

    // Fuzzy: inclusion checks (e.g., padded/objectId forms)
    for (const c of candidatosExtraidos) {
      const cNorm = normalize(c);
      if (!cNorm || !usNorm) continue;
      // if one contains the other and length is reasonable
      if (cNorm === usNorm) { return true; }
      if (cNorm.length >= 6 && (usNorm.endsWith(cNorm) || cNorm.endsWith(usNorm) || usNorm.includes(cNorm) || cNorm.includes(usNorm))) { return true; }
    }

    // Deep scan: extraer todas las cadenas del objeto artículo (hasta cierta profundidad)
    const gatheredStrings: string[] = [];
    const gather = (obj: any, depth = 0) => {
      if (depth > 6 || obj == null) return;
      if (typeof obj === 'string') {
        gatheredStrings.push(obj);
        return;
      }
      if (typeof obj === 'number' || typeof obj === 'boolean') {
        gatheredStrings.push(String(obj));
        return;
      }
      if (Array.isArray(obj)) {
        for (const it of obj) gather(it, depth + 1);
        return;
      }
      if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) {
          try { gather(obj[k], depth + 1); } catch { /* ignore */ }
        }
      }
    };

    gather(articulo, 0);
    const gatheredNorm = gatheredStrings.map(s => normalize(s));
    if (gatheredNorm.some(s => s && (s === usNorm || (s.length >= 6 && (s.includes(usNorm) || usNorm.includes(s)))))) { return true; }

    // no pertenece al usuario

    return false;
  }

  private normalizarListaArticulos(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.articulos)) {
      return data.articulos;
    }

    return [];
  }

  private contarPorEstado(estadoObjetivo: string): number {
    return this.misArticulos.filter(articulo => this.normalizarEstado(articulo?.estado) === estadoObjetivo).length;
  }

  private normalizarEstado(estado: any): string {
    return String(estado || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
