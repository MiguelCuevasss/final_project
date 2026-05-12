import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GroupsService, Group } from '../../services/groups';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.html',
  styleUrls: ['./group-detail.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class GroupDetailComponent implements OnInit {
  groupId = '';
  group: Group | null = null;

  newMemberIdentifier = '';
  newMessage = '';
  errorMessage = '';
  successMessage = '';
  currentUserId = '';

  constructor(
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || '';

    this.groupId = this.route.snapshot.paramMap.get('id') || '';
    this.loadGroup();
  }

  loadGroup(): void {
    if (!this.groupId) {
      this.group = null;
      return;
    }

    this.groupsService.getGroupById(this.groupId).subscribe({
      next: (response) => {
        this.group = response.group;
      },
      error: (error) => {
        this.group = null;
        this.errorMessage = error?.error?.message || 'No se pudo cargar el grupo';
      }
    });
  }

  addMember(): void {
    if (!this.groupId) return;

    this.errorMessage = '';
    this.successMessage = '';

    const identifier = this.newMemberIdentifier.trim();

    if (!identifier) {
      this.errorMessage = 'Escribe un usuario o correo';
      return;
    }

    this.groupsService.addMember(this.groupId, identifier).subscribe({
      next: (response) => {
        this.group = response.group;
        this.newMemberIdentifier = '';
        this.successMessage = response.message || 'Persona agregada correctamente';
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo agregar la persona';
      }
    });
  }

  sendMessage(): void {
    if (!this.groupId) return;

    this.errorMessage = '';
    this.successMessage = '';

    const text = this.newMessage.trim();

    if (!text) {
      this.errorMessage = 'Escribe un mensaje válido';
      return;
    }

    if (!this.currentUserId) {
      this.errorMessage = 'No hay usuario autenticado';
      return;
    }

    this.groupsService.addMessage(this.groupId, this.currentUserId, text).subscribe({
      next: (response) => {
        this.group = response.group;
        this.newMessage = '';
        this.successMessage = response.message || 'Mensaje enviado';
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo enviar el mensaje';
      }
    });
  }
}