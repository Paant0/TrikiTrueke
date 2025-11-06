import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  
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

    alert('Cuenta creada exitosamente.\nYa puedes iniciar sesión.');
    this.toggleForm('login'); 
  }

  onLogin(event: Event) {
    event.preventDefault();

    alert(' Inicio de sesión exitoso.');
    this.router.navigate(['/home']); 
  }
}
