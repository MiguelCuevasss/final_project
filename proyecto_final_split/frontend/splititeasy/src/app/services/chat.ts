import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  // GET historial
  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.apiUrl);
  }

  // POST mensaje
  sendMessage(data: FormData): Observable<ChatMessage> {
  return this.http.post<ChatMessage>(
    this.apiUrl,
    data
    );
  }

  // PATCH editar mensaje
  updateMessage(id: string, message: string): Observable<ChatMessage> {
    return this.http.patch<ChatMessage>(
      `${this.apiUrl}/${id}`,
      { message }
    );
  }

}