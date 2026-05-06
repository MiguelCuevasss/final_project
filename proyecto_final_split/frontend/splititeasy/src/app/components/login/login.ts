import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

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
      if (!this.formData.name.trim() || !this.formData.lastname.trim()) {
        this.errorMessage = 'Completa nombre y apellido';
        return;
      }

      if (!this.formData.username.trim()) {
        this.errorMessage = 'Escribe un nombre de usuario';
        return;
      }

      const email = this.formData.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.errorMessage = 'Escribe un correo válido';
        return;
      }

      if (this.passwordsDoNotMatch()) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      const result = this.authService.register({
        name: this.formData.name,
        lastname: this.formData.lastname,
        username: this.formData.username,
        email: this.formData.email,
        password: this.formData.password
      });

      if (!result.success) {
        this.errorMessage = result.message;
        return;
      }

      this.successMessage = result.message;
      this.router.navigate(['/login']);
      return;
    }

    if (!this.formData.identifier.trim()) {
      this.errorMessage = 'Escribe tu usuario o correo';
      return;
    }

    const result = this.authService.login(
      this.formData.identifier,
      this.formData.password
    );

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    this.successMessage = result.message;
    this.router.navigate(['/groups']);
  }
}