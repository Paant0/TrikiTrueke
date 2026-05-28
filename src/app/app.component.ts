import { Component, OnInit, PLATFORM_ID, inject, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { ArticulosService } from './Services/articulos.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Empieza en false para que no se vea nada mientras Angular decide la ruta
  mostrarLayout = false;
  isReady = false; // Nuevo estado para ocultar TODO el app hasta que el router termine
  private readonly platformId = inject(PLATFORM_ID);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  private searchRequestId = 0;

  searchQuery = '';
  searchResults: any[] = [];
  searchLoading = false;
  searchOpen = false;

  constructor(
    private router: Router,
    public authService: AuthService, // Cambiado a public para usar en el template
    private articulosService: ArticulosService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Usamos urlAfterRedirects por si el Guard hizo una redirección a /login
        this.mostrarLayout = !event.urlAfterRedirects.includes('/login');
        this.isReady = true; // El router ya decidió a dónde ir, podemos mostrar la vista
      }
    });
  }
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.authService.initSession().subscribe({
      next: () => {},
      error: (err) => console.warn('initSession failed', err)
    });
  }

  onSearchInput(value: string): void {
    this.searchQuery = value;
    this.searchOpen = true;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const termino = value.trim();
    if (termino.length < 2) {
      this.searchRequestId++;
      this.searchResults = [];
      this.searchLoading = false;
      return;
    }

    this.searchLoading = true;
    const requestId = ++this.searchRequestId;

    this.searchTimeout = setTimeout(() => {
      this.articulosService.buscarArticulos(termino).subscribe({
        next: (response) => {
          if (requestId !== this.searchRequestId) return;
          const lista = Array.isArray(response) ? response : (response?.data ?? []);
          this.searchResults = lista.slice(0, 6);
          this.searchLoading = false;
          this.searchOpen = true;
        },
        error: () => {
          if (requestId !== this.searchRequestId) return;
          this.searchResults = [];
          this.searchLoading = false;
          this.searchOpen = true;
        }
      });
    }, 250);
  }

  focusSearch(): void {
    this.searchOpen = true;
  }

  clearSearch(): void {
    this.searchRequestId++;
    this.searchQuery = '';
    this.searchResults = [];
    this.searchLoading = false;
    this.searchOpen = false;
  }

  selectSearchResult(id: string): void {
    this.searchOpen = false;
    this.searchQuery = '';
    this.searchResults = [];
    this.router.navigate(['/articulos', id]);
  }

  obtenerNombreUsuarioResultado(articulo: any): string {
    return articulo?.usuarioNombre || articulo?.nombreUsuario || articulo?.autorNombre || 'Usuario';
  }

  get primerNombre(): string {
    const fullNombre = this.authService.currentUser?.nombre || 'Usuario';
    return fullNombre.split(' ')[0];
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
        // Forzamos redirección aunque falle en el backend
        this.router.navigate(['/login']);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest?.('.topbar__search-shell')) {
      this.searchOpen = false;
    }
  }
}
