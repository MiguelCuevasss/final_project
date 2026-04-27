import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {

  isLogin = true;

  formData = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  toggleMode() {
    this.isLogin = !this.isLogin;
  }

  submitForm(event: Event) {
    event.preventDefault();

    if (!this.isLogin) {
      if (this.formData.password !== this.formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      console.log('Registro:', this.formData);
    } else {
      console.log('Login:', this.formData);
    }
  }
}