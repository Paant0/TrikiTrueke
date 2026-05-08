import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest, RegisterRequest } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // ─── Estado del formulario ───────────────────────────────────────────────────
  loginData: LoginRequest = { email: '', clave: '' };

  registerData: RegisterRequest = {
    nombre: '',
    email: '',
    telefono: '',
    clave: ''
  };

  // ─── Estados reactivos ───────────────────────────────────────────────────────
  isLoadingLogin  = signal(false);
  isLoadingReg    = signal(false);
  errorLogin      = signal<string | null>(null);
  errorRegister   = signal<string | null>(null);
  successRegister = signal<string | null>(null);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // ─── Toggle de paneles ───────────────────────────────────────────────────────
  toggleForm(mode: 'register' | 'login') {
    const container = document.getElementById('container');
    // Limpiamos mensajes al cambiar de panel
    this.errorLogin.set(null);
    this.errorRegister.set(null);
    this.successRegister.set(null);

    if (mode === 'register') {
      container?.classList.add('active');
    } else {
      container?.classList.remove('active');
    }
  }

  // ─── Login ────────────────────────────────────────────────────────────────────
  onLogin(event: Event) {
    event.preventDefault();
    if (this.isLoadingLogin()) return;

    this.errorLogin.set(null);
    this.isLoadingLogin.set(true);

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.isLoadingLogin.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoadingLogin.set(false);
        const msg = err?.error?.message ?? 'Correo o contraseña incorrectos.';
        this.errorLogin.set(msg);
        console.error('Login error:', err);
      }
    });
  }

  // ─── Registro ─────────────────────────────────────────────────────────────────
  onRegister(event: Event) {
    event.preventDefault();
    if (this.isLoadingReg()) return;

    this.errorRegister.set(null);
    this.successRegister.set(null);
    this.isLoadingReg.set(true);

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoadingReg.set(false);
        this.successRegister.set('¡Cuenta creada! Ahora inicia sesión.');
        this.registerData = { nombre: '', email: '', telefono: '', clave: '' };
        setTimeout(() => this.toggleForm('login'), 1800);
      },
      error: (err) => {
        this.isLoadingReg.set(false);
        const msg = err?.error?.message ?? 'Error al crear la cuenta. Inténtalo de nuevo.';
        this.errorRegister.set(msg);
        console.error('Register error:', err);
      }
    });
  }
}