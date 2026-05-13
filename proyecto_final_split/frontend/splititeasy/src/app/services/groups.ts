import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GroupMember {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
}

export interface GroupMessage {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  createdById: string;
  members: GroupMember[];
  messages: GroupMessage[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private apiUrl = 'https://splititeasy-backend.onrender.com/api/groups';

  constructor(private http: HttpClient) {}

  getGroups(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  getGroupById(groupId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${groupId}`);
  }

  createGroup(name: string, createdById: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      name,
      createdById
    });
  }

  addMember(groupId: string, identifier: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/members`, {
      identifier
    });
  }

  addMessage(groupId: string, authorId: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/messages`, {
      authorId,
      text
    });
  }
}