import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { AyudaComponent } from './ayuda/ayuda.component';

export const routes: Routes = [
   { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'articulos', component: ArticulosComponent },
  { path: 'mensajes', component: MensajesComponent },
  { path: 'ayuda', component: AyudaComponent },
  { path: '**', redirectTo: '' }
];
