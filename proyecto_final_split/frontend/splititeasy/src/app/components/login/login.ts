import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {

  constructor(private authService: AuthService) {}

  isLogin = true;

  errorMessage: string = '';
  successMessage: string = '';

  formData = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  passwordsDoNotMatch(): boolean {
    return (
      !this.isLogin &&
      this.formData.confirmPassword.length > 0 &&
      this.formData.password !== this.formData.confirmPassword
    );
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitForm(event: Event) {
    event.preventDefault();

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isLogin) {

      if (!this.formData.name || !this.formData.lastname) {
        this.errorMessage = 'Completa nombre y apellido';
        return;
      }

      if (this.passwordsDoNotMatch()) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      const result = this.authService.register(this.formData);

      if (!result.success) {
        this.errorMessage = result.message;
        return;
      }

      this.successMessage = result.message;

    } else {

      const result = this.authService.login(
        this.formData.email,
        this.formData.password
      );

      if (!result.success) {
        this.errorMessage = result.message;
        return;
      }

      this.successMessage = result.message;
    }
  }
}