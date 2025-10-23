import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-login',
standalone: true,
  templateUrl: './login.component.html',
  imports: [RouterLink],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

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
