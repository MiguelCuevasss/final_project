import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GroupsService, Group } from '../../services/groups';
import { AuthService } from '../../services/auth';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.html',
  styleUrls: ['./groups.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class GroupsComponent {

  groups: Group[] = [];
  newGroupName = '';
  errorMessage = '';
  successMessage = '';
  currentUserName = 'Usuario';

  // Chat 
  userMessage: string = '';
  aiResponse: string = '';
  loading: boolean = false;

  constructor(
    private groupsService: GroupsService,
    private authService: AuthService,
    private chatService: ChatService // 👈 IMPORTANTE
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserName = currentUser?.name || 'Usuario';
    this.loadGroups();
  }

  loadGroups() {
    this.groups = [...this.groupsService.getGroups()];
  }

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

  // CHAT
  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    this.loading = true;

    this.chatService.sendMessage(this.userMessage).subscribe({
      next: (response) => {
        this.aiResponse = response.aiResponse;
        this.userMessage = '';
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.aiResponse = 'Error al comunicarse con la IA';
        this.loading = false;
      }
    });
  }
}