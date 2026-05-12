import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

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
  private apiUrl = 'https://splititeasy-backend.onrender.com/api/auth';
  private storageKey = 'currentUser';
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.readCurrentUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: { identifier: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response?.user) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  getCurrentUser(): CurrentUser | null {
    const current = this.currentUserSubject.value;
    return current ? this.normalizeUser(current) : null;
  }

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

  logout(): void {
    this.setCurrentUser(null);
  }

  getProfileById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me/${id}`);
  }

  updateProfile(id: string, profile: { name: string; email: string; description: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/${id}`, profile).pipe(
      tap((response) => {
        if (response?.user) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }

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