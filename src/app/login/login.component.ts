import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [RouterLink],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {
    // 👇 Esto garantiza que no se use document en el servidor
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    //ejecuta solo si estamos en el navegadorng 
    if (!this.isBrowser) return;

    const container = this.document.getElementById('container');
    const registerBtn = this.document.getElementById('register');
    const loginBtn = this.document.getElementById('login');

    if (registerBtn && container) {
      registerBtn.addEventListener('click', () => {
        container.classList.add('active');
      });
    }

    if (loginBtn && container) {
      loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
      });
    }
  }
}

