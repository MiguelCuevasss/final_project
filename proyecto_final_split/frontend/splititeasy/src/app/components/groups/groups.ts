import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GroupsService, Group } from '../../services/groups';
import { AuthService } from '../../services/auth';
import { ChatService, ChatMessage } from '../../services/chat';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.html',
  styleUrls: ['./groups.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})

export class GroupsComponent {

  groups: Group[] = [];

  messages: ChatMessage[] = [];

  newGroupName = '';

  errorMessage = '';
  successMessage = '';

  currentUserName = 'Usuario';

  userMessage = '';

  loading = false;

  editingMessageId: string | null = null;
  editedMessage = '';

  suggestedUsers = [
    {
      name: 'Miguel Cuevas',
      username: 'cuevasss_',
      mutualGroups: 4,
      avatar: '/cuevasss_.png'
    },
    {
      name: 'Jimena Estrada',
      username: 'jimenaestradad',
      mutualGroups: 6,
      avatar: '/jimenaestradad.png'
    },
    {
      name: 'Valeria Pérez',
      username: 'vale.perez',
      mutualGroups: 3,
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    {
      name: 'Diego López',
      username: 'diegolopez',
      mutualGroups: 2,
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      name: 'Camila Torres',
      username: 'cami.torres',
      mutualGroups: 5,
      avatar: 'https://i.pravatar.cc/150?img=47'
    }
  ];

  constructor(
    private groupsService: GroupsService,
    private authService: AuthService,
    private chatService: ChatService
  ) {

    const currentUser = this.authService.getCurrentUser();

    this.currentUserName = currentUser?.name || 'Usuario';

    this.loadGroups();

    this.loadMessages();

  }

  // CARGAR GRUPOS

  loadGroups() {

    this.groups = [...this.groupsService.getGroups()];

  }

  // CARGAR HISTORIAL CHAT


  loadMessages() {

    this.chatService.getMessages().subscribe({

      next: (data) => {

        this.messages = data;

      },

      error: (error) => {

        console.error(error);

      }

    });

  }


  // CREAR GRUPO

  createGroup() {

    this.errorMessage = '';

    this.successMessage = '';

    const name = this.newGroupName.trim();

    if (!name) {

      this.errorMessage = 'Escribe un nombre para el grupo';

      return;

    }

    this.groupsService.createGroup(name, this.currentUserName);

    this.newGroupName = '';

    this.successMessage = 'Grupo creado correctamente';

    this.loadGroups();

  }

  // ENVIAR MENSAJE

  sendMessage(): void {

    if (!this.userMessage.trim()) return;

    this.loading = true;

    this.chatService.sendMessage(this.userMessage).subscribe({

      next: (response) => {

        this.messages.push(response);

        this.userMessage = '';

        this.loading = false;

      },

      error: (error) => {

        console.error(error);

        this.loading = false;

      }

    });

  }

startEditing(message: ChatMessage): void {
  this.editingMessageId = message._id || null;
  this.editedMessage = message.userMessage;
}

cancelEditing(): void {
  this.editingMessageId = null;
  this.editedMessage = '';
}

saveEdit(message: ChatMessage): void {

  if (!message._id) return;

  this.chatService.updateMessage(
    message._id,
    this.editedMessage
  ).subscribe({

    next: (updatedMessage) => {

      const index = this.messages.findIndex(
        m => m._id === updatedMessage._id
      );

      if (index !== -1) {
        this.messages[index] = updatedMessage;
      }

      this.cancelEditing();
    },

    error: (error) => {
      console.error(error);
    }
  });
}  


}