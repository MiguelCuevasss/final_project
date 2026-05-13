// Componente principal de la vista de grupos.
// Se encarga de:
// - listar grupos del usuario
// - crear grupos nuevos
// - mostrar el chat con IA
// - subir imágenes
// - editar mensajes guardados

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GroupsService, Group } from '../../services/groups';
import { AuthService } from '../../services/auth.service';
import { ChatService, ChatMessage } from '../../services/chat';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.html',
  styleUrls: ['./groups.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  newGroupName = '';

  errorMessage = '';
  successMessage = '';

  currentUserId = '';
  currentUserName = 'Usuario';

  userMessage = '';
  loading = false;
  messages: ChatMessage[] = [];

  editingMessageId: string | null = null;
  editedMessage = '';

  selectedImage: File | null = null;

  // Lista fija de usuarios sugeridos
  // que se muestra en la interfaz.
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
  ) {}

  // Al iniciar el componente:
  // - obtiene el usuario autenticado
  // - carga los grupos del usuario
  // - carga el historial del chat con IA
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser?.id) {
      this.currentUserId = currentUser.id;
      this.currentUserName = currentUser.name || 'Usuario';
      this.loadGroups();
    } else {
      this.errorMessage = 'No hay usuario autenticado';
    }

    this.loadMessages();
  }

  // Obtiene los grupos del usuario autenticado
  // desde el backend.
  loadGroups(): void {
    if (!this.currentUserId) {
      return;
    }

    this.groupsService.getGroups(this.currentUserId).subscribe({
      next: (response: any) => {
        this.groups = response?.groups || [];
      },
      error: (error: any) => {
        this.errorMessage = error?.error?.message || 'No se pudieron cargar los grupos';
      }
    });
  }

  // Crea un nuevo grupo usando el nombre escrito
  // por el usuario actual.
  createGroup(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const name = this.newGroupName.trim();

    if (!name) {
      this.errorMessage = 'Escribe un nombre para el grupo';
      return;
    }

    if (!this.currentUserId) {
      this.errorMessage = 'No hay usuario autenticado';
      return;
    }

    this.groupsService.createGroup(name, this.currentUserId).subscribe({
      next: (response: any) => {
        this.newGroupName = '';
        this.successMessage = response?.message || 'Grupo creado correctamente';
        this.loadGroups();
      },
      error: (error: any) => {
        this.errorMessage = error?.error?.message || 'No se pudo crear el grupo';
      }
    });
  }

  // Carga el historial de mensajes
  // del asistente de IA.
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

  // Da formato a la respuesta de la IA
  // para mostrar negritas y listas dentro del HTML.
  formatAiResponse(text: string): string {
    if (!text) return '';

    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const withBold = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const lines = withBold.split('\n');

    const formatted: string[] = [];
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('- ')) {
        if (!inList) {
          formatted.push('<ul>');
          inList = true;
        }
        formatted.push(`<li>${trimmed.slice(2)}</li>`);
      } else {
        if (inList) {
          formatted.push('</ul>');
          inList = false;
        }
        if (trimmed) {
          formatted.push(`<p>${trimmed}</p>`);
        } else {
          formatted.push('<br>');
        }
      }
    }

    if (inList) {
      formatted.push('</ul>');
    }

    return formatted.join('');
  }

  // Guarda el archivo de imagen seleccionado
  // para enviarlo junto al mensaje.
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    this.selectedImage = file;
  }

  // Envía un mensaje al asistente de IA.
  // Si hay imagen, también la manda en FormData.
  sendMessage(): void {
    if (!this.userMessage.trim() && !this.selectedImage) {
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('message', this.userMessage);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.chatService.sendMessage(formData).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.userMessage = '';
        this.selectedImage = null;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  // Activa el modo de edición
  // para un mensaje específico.
  startEditing(message: ChatMessage): void {
    this.editingMessageId = message._id || null;
    this.editedMessage = message.userMessage;
  }

  // Cancela la edición actual
  // y limpia el estado temporal.
  cancelEditing(): void {
    this.editingMessageId = null;
    this.editedMessage = '';
  }

  // Guarda los cambios hechos sobre
  // un mensaje ya existente.
  saveEdit(message: ChatMessage): void {
    if (!message._id) return;

    this.chatService.updateMessage(message._id, this.editedMessage).subscribe({
      next: (updatedMessage) => {
        const index = this.messages.findIndex((m) => m._id === updatedMessage._id);

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