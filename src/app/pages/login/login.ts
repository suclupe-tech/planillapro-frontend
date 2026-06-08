import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  ingresar(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Ingrese email y contraseña';
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.authService.guardarSesion(response);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('ERROR LOGIN:', error);

        this.loading = false;

        if (error.status === 0) {
          this.errorMessage = 'Error de conexión o CORS entre Angular y el backend';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Credenciales incorrectas';
        } else {
          this.errorMessage = 'Error al iniciar sesión';
        }
      }
    });
  }
}