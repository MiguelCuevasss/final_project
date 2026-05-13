// Servicio encargado del manejo del perfil.
// Permite:
// - obtener información del usuario actual
// - leer datos almacenados en sesión/localStorage
// - guardar cambios del perfil en el backend

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService, CurrentUser } from './auth.service';


// Estructura del perfil editable.
export interface Profile {
  name: string;
  email: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private authService: AuthService) {}

  // Obtiene el usuario almacenado actualmente,
  // ya sea desde AuthService o localStorage.
  private getStoredUser(): CurrentUser | null {
    const current = this.authService.getCurrentUser();

    if (current?.id) {
      return current;
    }

    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem('currentUser');

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      const id = parsed?.id || parsed?._id || '';

      if (!id) return null;

      return {
        id,
        _id: parsed?._id || id,
        name: parsed?.name || '',
        lastname: parsed?.lastname || '',
        username: parsed?.username || '',
        email: parsed?.email || '',
        description: parsed?.description || ''
      };
    } catch {
      return null;
    }
  }

  // Obtiene la información del perfil
  // para mostrarla en el formulario.
  getProfile(): Observable<Profile> {
    const user = this.getStoredUser();

    if (!user?.id) {
      return of({
        name: '',
        email: '',
        description: ''
      });
    }

    return of({
      name: user.name || '',
      email: user.email || '',
      description: user.description || ''
    });
  }

  // Guarda cambios del perfil
  // utilizando AuthService y el backend.
  saveProfile(profile: Profile): Observable<any> {
    const user = this.getStoredUser();

    if (!user?.id) {
      return of({
        success: false,
        message: 'No hay usuario autenticado'
      });
    }

    return this.authService.updateProfile(user.id, profile);
  }
}