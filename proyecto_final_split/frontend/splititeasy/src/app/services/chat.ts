// Servicio encargado de la comunicación
// entre Angular y las rutas del chat con IA.
// Permite:
// - obtener historial de conversaciones
// - enviar mensajes e imágenes
// - editar mensajes existentes

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// Estructura de un mensaje del chat IA.
export interface ChatMessage {
  _id?: string;
  userMessage: string;
  aiResponse: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // URL base del backend para el chat IA.
  private apiUrl = 'https://splititeasy-backend.onrender.com/api/chat';

  constructor(private http: HttpClient) {}

  // Obtiene el historial completo
  // de conversaciones guardadas.
  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.apiUrl);
  }

  // Envía un mensaje al backend.
  // También puede incluir imágenes usando FormData.
  sendMessage(data: FormData): Observable<ChatMessage> {
  return this.http.post<ChatMessage>(
    this.apiUrl,
    data
    );
  }

  // Edita un mensaje existente
  // y genera una nueva respuesta de IA.
  updateMessage(id: string, message: string): Observable<ChatMessage> {
    return this.http.patch<ChatMessage>(
      `${this.apiUrl}/${id}`,
      { message }
    );
  }

}