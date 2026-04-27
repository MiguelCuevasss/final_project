import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: any[] = [];

  constructor() {
    const data = localStorage.getItem('users');
    this.users = data ? JSON.parse(data) : [];
  }

  register(user: any) {
    const email = user.email.trim().toLowerCase();

    const exists = this.users.find(u => u.email === email);

    if (exists) {
      return {
        success: false,
        message: 'Este correo ya está registrado'
      };
    }

    const newUser = {
      ...user,
      email
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));

    return {
      success: true,
      message: 'Usuario registrado correctamente'
    };
  }

  login(email: string, password: string) {
    const user = this.users.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

    return {
      success: true,
      message: 'Login exitoso',
      user
    };
  }
}