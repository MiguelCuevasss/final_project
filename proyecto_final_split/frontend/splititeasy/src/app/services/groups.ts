import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface Group {
  _id?: string;
  name: string;
  members: any[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private apiUrl =
    'https://splititeasy-backend.onrender.com/api/groups';

  constructor(
    private http: HttpClient
  ) {}

  // OBTENER GRUPOS
  getGroups(): Observable<Group[]> {

    return this.http.get<Group[]>(
      this.apiUrl
    );
  }

  // CREAR GRUPO
  createGroup(
    name: string,
    userId: string
  ): Observable<Group> {

    return this.http.post<Group>(
      this.apiUrl,
      {
        name,
        userId
      }
    );
  }

  // AGREGAR MIEMBRO
  addMember(
    groupId: string,
    userId: string
  ): Observable<Group> {

    return this.http.patch<Group>(
      `${this.apiUrl}/${groupId}/add-member`,
      {
        userId
      }
    );
  }
}