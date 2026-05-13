// Servicio principal de autenticación.
// Se encarga de:
// - login y registro
// - manejo de sesión
// - persistencia del usuario en localStorage
// - actualización del perfil
// - compartir el usuario actual entre componentes

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';


// Estructura del usuario autenticado
// utilizada en toda la aplicación.
export interface CurrentUser {
  id: string;
  _id?: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base del backend y claves
  // de almacenamiento local.
  private apiUrl = 'https://splititeasy-backend.onrender.com/api/auth';
  private storageKey = 'currentUser';

  // BehaviorSubject que mantiene
  // el estado global del usuario autenticado.
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.readCurrentUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Registra un nuevo usuario
  // en el backend.
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // Inicia sesión y guarda automáticamente
  // el usuario autenticado en localStorage.
  login(credentials: { identifier: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response?.user) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  // Devuelve el usuario actual almacenado
  // en memoria.
  getCurrentUser(): CurrentUser | null {
    const current = this.currentUserSubject.value;
    return current ? this.normalizeUser(current) : null;
  }

  // Guarda o elimina el usuario actual
  // tanto en memoria como en localStorage.
  setCurrentUser(user: any): void {
    if (!user) {
      localStorage.removeItem(this.storageKey);
      this.currentUserSubject.next(null);
      return;
    }

    const normalized = this.normalizeUser(user);
    localStorage.setItem(this.storageKey, JSON.stringify(normalized));
    this.currentUserSubject.next(normalized);
  }

  // Cierra sesión eliminando
  // el usuario almacenado.
  logout(): void {
    this.setCurrentUser(null);
  }

  // Obtiene información del perfil
  // desde el backend usando ID.
  getProfileById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me/${id}`);
  }

  // Actualiza el perfil del usuario
  // y sincroniza los nuevos datos en sesión.
  updateProfile(id: string, profile: { name: string; email: string; description: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/${id}`, profile).pipe(
      tap((response) => {
        if (response?.user) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  // Normaliza la estructura del usuario
  // para mantener consistencia entre frontend y backend.
  private normalizeUser(user: any): CurrentUser {
    const id = user?.id || user?._id || '';

    return {
      id,
      _id: user?._id || user?.id || '',
      name: user?.name || '',
      lastname: user?.lastname || '',
      username: user?.username || '',
      email: user?.email || '',
      description: user?.description || ''
    };
  }

  // Lee el usuario almacenado en localStorage
  // cuando la aplicación inicia.
  private readCurrentUser(): CurrentUser | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      return this.normalizeUser(JSON.parse(raw));
    } catch {
      return null;
    }
  }
}