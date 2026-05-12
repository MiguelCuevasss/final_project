import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService, CurrentUser } from './auth.service';

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