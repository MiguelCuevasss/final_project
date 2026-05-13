import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

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
  currentUserName = 'Usuario';

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || '';
    this.currentUserName = currentUser?.name || 'Usuario';

    this.groupId = this.route.snapshot.paramMap.get('id') || '';

    const nav = history.state?.group as Group | undefined;
    if (nav && String(nav.id) === String(this.groupId)) {
      this.group = nav;
      this.isLoading = false;
      return;
    }

    this.loadGroup();
  }

  loadGroup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.groupId) {
      this.group = null;
      this.errorMessage = 'No se encontró el grupo';
      this.isLoading = false;
      return;
    }

    if (!this.currentUserId) {
      this.group = null;
      this.errorMessage = 'No hay usuario autenticado';
      this.isLoading = false;
      return;
    }

    this.groupsService
      .getGroups(this.currentUserId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          const groups: Group[] = response?.groups || [];
          const found = groups.find(
            (g) => String(g.id) === String(this.groupId)
          );

          if (!found) {
            this.group = null;
            this.errorMessage = 'No se encontró el grupo';
            return;
          }

          this.group = found;
        },
        error: (error: any) => {
          this.group = null;
          this.errorMessage =
            error?.error?.message || 'No se pudo cargar el grupo';
        }
      });
  }

  addMember(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const identifier = this.newMemberIdentifier.trim();

    if (!identifier) {
      this.errorMessage = 'Escribe un usuario o correo';
      return;
    }

    this.groupsService.addMember(this.groupId, identifier).subscribe({
      next: (response: any) => {
        this.group = response.group;
        this.newMemberIdentifier = '';
        this.successMessage = response.message || 'Miembro agregado correctamente';
      },
      error: (error: any) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo agregar el miembro';
      }
    });
  }

  sendMessage(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const text = this.newMessage.trim();

    if (!text) {
      this.errorMessage = 'Escribe un mensaje';
      return;
    }

    if (!this.currentUserId) {
      this.errorMessage = 'No hay usuario autenticado';
      return;
    }

    this.groupsService.addMessage(this.groupId, this.currentUserId, text).subscribe({
      next: (response: any) => {
        this.group = response.group;
        this.newMessage = '';
        this.successMessage = response.message || 'Mensaje enviado';
      },
      error: (error: any) => {
        this.errorMessage =
          error?.error?.message || 'No se pudo enviar el mensaje';
      }
    });
  }
}