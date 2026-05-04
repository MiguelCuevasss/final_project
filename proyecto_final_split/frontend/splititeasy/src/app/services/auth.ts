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
      name: user.name.trim(),
      lastname: user.lastname.trim(),
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

  login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = this.users.find(
      u => u.email === normalizedEmail && u.password === password
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