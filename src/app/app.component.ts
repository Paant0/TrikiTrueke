import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

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
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Empieza en false para que no se vea nada mientras Angular decide la ruta
  mostrarLayout = false;
  isReady = false; // Nuevo estado para ocultar TODO el app hasta que el router termine

  constructor(
    private router: Router,
    public authService: AuthService // Cambiado a public para usar en el template
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Usamos urlAfterRedirects por si el Guard hizo una redirección a /login
        this.mostrarLayout = !event.urlAfterRedirects.includes('/login');
        this.isReady = true; // El router ya decidió a dónde ir, podemos mostrar la vista
      }
    });
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
}
