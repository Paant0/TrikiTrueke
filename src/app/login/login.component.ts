import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // DATOS LOGIN
  loginData = {
    email: '',
    clave: ''
  };

  // DATOS REGISTRO
  registerData = {
    nombre: '',
    email: '',
    telefono: '',
    clave: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleForm(mode: string) {
    const container = document.getElementById('container');

    if (mode === 'register') {
      container?.classList.add('active');
    } else {
      container?.classList.remove('active');
    }
  }

  onRegister(event: Event) {
    event.preventDefault();

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        alert('Usuario registrado correctamente');
        console.log(response);

        this.toggleForm('login');
      },
      error: (error) => {
        console.log(error);
        alert('Error al registrar usuario');
      }
    });
  }

  onLogin(event: Event) {
    event.preventDefault();

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        alert('Login exitoso');
        console.log(response);

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error);
        alert('Credenciales incorrectas');
      }
    });
  }
}