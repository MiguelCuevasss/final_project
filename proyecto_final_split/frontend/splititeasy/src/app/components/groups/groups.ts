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

  // GROUPS

  groups: Group[] = [];
  newGroupName = '';

  errorMessage = '';
  successMessage = '';

  currentUserName = 'Usuario';


  // CHAT


  userMessage = '';
  loading = false;

  messages: ChatMessage[] = [];

  editingMessageId: string | null = null;
  editedMessage = '';

  // IMAGEN
  selectedImage: File | null = null;


  // SUGGESTED USERS


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


  // CONSTRUCTOR


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


  // GROUPS


  loadGroups(): void {
    this.groups = [...this.groupsService.getGroups()];
  }

  createGroup(): void {

    this.errorMessage = '';
    this.successMessage = '';

    const name = this.newGroupName.trim();

    if (!name) {
      this.errorMessage = 'Escribe un nombre para el grupo';
      return;
    }

    this.groupsService.createGroup(
      name,
      this.currentUserName
    );

    this.newGroupName = '';

    this.successMessage = 'Grupo creado correctamente';

    this.loadGroups();
  }


  // CHAT


  loadMessages(): void {

    this.chatService.getMessages().subscribe({

      next: (messages) => {
        this.messages = messages;
      },

      error: (error) => {
        console.error(error);
      }
    });
  }


  // IMAGEN


  onImageSelected(event: any): void {

    const file = event.target.files[0];

    if (file) {
      this.selectedImage = file;
    }
  }


  // ENVIAR MENSAJE


  sendMessage(): void {

    if (!this.userMessage.trim() && !this.selectedImage) {
      return;
    }

    this.loading = true;

    // FORM DATA
    const formData = new FormData();

    formData.append(
      'message',
      this.userMessage
    );

    // SI HAY IMAGEN
    if (this.selectedImage) {

      formData.append(
        'image',
        this.selectedImage
      );
    }

    this.chatService.sendMessage(formData).subscribe({

      next: (response) => {

        this.messages.push(response);

        this.userMessage = '';

        // LIMPIAR IMAGEN
        this.selectedImage = null;

        this.loading = false;
      },

      error: (error) => {

        console.error(error);

        this.loading = false;
      }
    });
  }


  // EDITAR MENSAJES


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