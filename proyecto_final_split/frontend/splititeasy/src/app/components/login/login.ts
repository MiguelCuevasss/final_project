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

  // REGISTER

  if (!this.isLogin) {

    const userData = {
      name: this.formData.name,
      lastname: this.formData.lastname,
      username: this.formData.username,
      email: this.formData.email,
      password: this.formData.password
    };

    this.authService.register(userData).subscribe({

      next: (response) => {

        this.successMessage = response.message;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);

      },

      error: (error) => {

        this.errorMessage =
          error.error.message || 'Error al registrar usuario';

      }

    });

    return;
  }

  // LOGIN

  const credentials = {
    identifier: this.formData.identifier,
    password: this.formData.password
  };

  this.authService.login(credentials).subscribe({

    next: (response) => {

      this.successMessage = response.message;

      localStorage.setItem(
        'currentUser',
        JSON.stringify(response.user)
      );

      setTimeout(() => {
        this.router.navigate(['/groups']);
      }, 1000);

    },

    error: (error) => {

      this.errorMessage =
        error.error.message || 'Credenciales incorrectas';

    }

  });
}
}