import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password || !this.email) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
    const authenticated = this.auth.login(
      this.username,
      this.password,
      this.email
    );
    if (authenticated) {
      this.router.navigateByUrl('/characters');
    } else {
      this.error = 'Credenciales inválidas';
    }
  }
}
