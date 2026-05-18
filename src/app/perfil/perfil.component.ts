import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatDividerModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  readonly quickActions = [
    { icon: 'category', label: 'Explorar categorías', route: '/categorias' },
    { icon: 'shopping_bag', label: 'Ver artículos', route: '/articulos' },
    { icon: 'forum', label: 'Abrir mensajes', route: '/mensajes' }
  ];

  constructor(public authService: AuthService) { }

}
