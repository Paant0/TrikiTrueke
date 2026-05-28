import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { ArticuloDetalleComponent } from './articulos/articulo-detalle.component';
import { MisArticulosComponent } from './mis-articulos/mis-articulos.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { PerfilComponent } from './perfil/perfil.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [authGuard] },
  { path: 'mis-articulos', component: MisArticulosComponent, canActivate: [authGuard] },
  { path: 'articulos/categoria/:categoria', component: ArticulosComponent, canActivate: [authGuard] },
  { path: 'articulos/:id', component: ArticuloDetalleComponent, canActivate: [authGuard] },
  { path: 'articulos', component: ArticulosComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'ayuda', component: AyudaComponent },
];
