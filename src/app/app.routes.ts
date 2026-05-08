import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [authGuard] },
  { path: 'articulos/:categoria', component: ArticulosComponent, canActivate: [authGuard] },
  { path: 'articulos', component: ArticulosComponent, canActivate: [authGuard] },
  { path: 'mensajes', component: MensajesComponent, canActivate: [authGuard] },
  { path: 'ayuda', component: AyudaComponent }, // Dejo la ayuda pública, o cámbiala si requiere login
];
