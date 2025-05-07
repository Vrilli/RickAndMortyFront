import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }
    const success = this.auth.register(
      this.username,
      this.password,
      this.email
    );
    if (!success) {
      this.error = 'Este correo ya está registrado.';
      return;
    }
    this.error = '';
    this.router.navigate(['/characters']); 
  }
}
