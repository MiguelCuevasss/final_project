import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface GroupMessage {

  _id?: string;

  groupId: string;

  senderName: string;

  text: string;

  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {

  private apiUrl =
    'http://localhost:3000/api/group-messages';

  constructor(
    private http: HttpClient
  ) {}

  getMessages(
    groupId: string
  ): Observable<GroupMessage[]> {

    return this.http.get<GroupMessage[]>(
      `${this.apiUrl}/${groupId}`
    );
  }

  sendMessage(
    message: GroupMessage
  ): Observable<GroupMessage> {

    return this.http.post<GroupMessage>(
      this.apiUrl,
      message
    );
  }
}