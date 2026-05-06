import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: any[] = [];
  private currentUser: any = null;

  constructor() {
    const usersData = localStorage.getItem('users');
    const currentUserData = localStorage.getItem('currentUser');

    this.users = usersData ? JSON.parse(usersData) : [];
    this.currentUser = currentUserData ? JSON.parse(currentUserData) : null;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  register(user: any) {
    const email = user.email.trim().toLowerCase();
    const username = user.username.trim().toLowerCase();

    if (!this.isValidEmail(email)) {
      return {
        success: false,
        message: 'Escribe un correo válido'
      };
    }

    const emailExists = this.users.find(u => u.email === email);
    if (emailExists) {
      return {
        success: false,
        message: 'Este correo ya está registrado'
      };
    }

    const usernameExists = this.users.find(u => u.username === username);
    if (usernameExists) {
      return {
        success: false,
        message: 'Este usuario ya existe'
      };
    }

    const newUser = {
      name: user.name.trim(),
      lastname: user.lastname.trim(),
      username,
      email,
      password: user.password
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));

    return {
      success: true,
      message: 'Usuario registrado correctamente'
    };
  }

  login(identifier: string, password: string) {
    const normalizedIdentifier = identifier.trim().toLowerCase();

    const user = this.users.find(
      u =>
        (u.email?.toLowerCase() === normalizedIdentifier ||
          u.username?.toLowerCase() === normalizedIdentifier) &&
        u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Credenciales incorrectas'
      };
    }

    this.currentUser = {
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      email: user.email
    };

    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    return {
      success: true,
      message: 'Login exitoso',
      user: this.currentUser
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}