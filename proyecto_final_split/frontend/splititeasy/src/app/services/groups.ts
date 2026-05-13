// Servicio encargado de la comunicación
// entre Angular y las rutas de grupos del backend.
// Permite:
// - obtener grupos
// - crear grupos
// - agregar miembros
// - enviar mensajes grupales

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// Estructura de un miembro dentro de un grupo.
export interface GroupMember {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
}


// Estructura de un mensaje grupal.
export interface GroupMessage {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}


// Estructura principal de un grupo.
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

  // URL base del backend para grupos.
  private apiUrl = 'https://splititeasy-backend.onrender.com/api/groups';

  constructor(private http: HttpClient) {}

  // Obtiene todos los grupos
  // donde participa un usuario.
  getGroups(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  // Obtiene un grupo específico
  // usando su ID.
  getGroupById(groupId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${groupId}`);
  }

  // Crea un nuevo grupo
  // usando el usuario autenticado como creador.
  createGroup(name: string, createdById: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {
      name,
      createdById
    });
  }

  // Agrega un nuevo miembro al grupo
  // usando username o email.
  addMember(groupId: string, identifier: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/members`, {
      identifier
    });
  }

  // Envía mensajes al chat grupal.
  addMessage(groupId: string, authorId: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/messages`, {
      authorId,
      text
    });
  }
}