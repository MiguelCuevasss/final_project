import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface CurrentUser {
  id: string;
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
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: CurrentUser | null): void {
    if (user) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.storageKey);
    }

    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  getProfileById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me/${id}`);
  }

  updateProfile(id: string, profile: Partial<CurrentUser>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/${id}`, profile).pipe(
      tap((response) => {
        if (response?.user) {
          this.setCurrentUser(response.user);
        }
      })
    );
  }

  private readCurrentUser(): CurrentUser | null {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }
}