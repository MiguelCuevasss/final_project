import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  isLogin = true;

  errorMessage: string = '';
  successMessage: string = '';

  formData = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    identifier: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.url.subscribe(segments => {
      this.isLogin = segments[0]?.path !== 'registro';
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  passwordsDoNotMatch(): boolean {
    return (
      !this.isLogin &&
      this.formData.confirmPassword.length > 0 &&
      this.formData.password !== this.formData.confirmPassword
    );
  }

  toggleMode() {
    this.router.navigate([this.isLogin ? '/registro' : '/login']);
  }

  submitForm(event: Event) {
    event.preventDefault();

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isLogin) {
      const userData = {
        name: this.formData.name.trim(),
        lastname: this.formData.lastname.trim(),
        username: this.formData.username.trim(),
        email: this.formData.email.trim(),
        password: this.formData.password
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Usuario registrado correctamente';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Error al registrar usuario';
        }
      });

      return;
    }

    const credentials = {
      identifier: this.formData.identifier.trim(),
      password: this.formData.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Login exitoso';

        setTimeout(() => {
          this.router.navigate(['/groups']);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Credenciales incorrectas';
      }
    });
  }
}