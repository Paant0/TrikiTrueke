import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AyudaComponent } from './ayuda/ayuda.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'articulos/:categoria', component: ArticulosComponent },
{ path: 'articulos', component: ArticulosComponent },
  { path: 'mensajes', component: MensajesComponent },
  { path: 'ayuda', component: AyudaComponent },
];
