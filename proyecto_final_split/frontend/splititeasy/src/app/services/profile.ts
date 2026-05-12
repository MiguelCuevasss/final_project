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

  getProfile(): Observable<Profile> {
    const current = this.authService.getCurrentUser();

    if (!current?.id) {
      return of({
        name: '',
        email: '',
        description: ''
      });
    }

    return of({
      name: current.name || '',
      email: current.email || '',
      description: current.description || ''
    });
  }

  saveProfile(profile: Profile): Observable<any> {
    const current = this.authService.getCurrentUser();

    if (!current?.id) {
      throw new Error('No hay usuario autenticado');
    }

    return this.authService.updateProfile(current.id, profile);
  }
}