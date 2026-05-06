import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GroupsService, Group } from '../../services/groups';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.html',
  styleUrls: ['./group-detail.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class GroupDetailComponent {
  groupId = 0;
  group: Group | undefined;

  newMemberName = '';
  newMessage = '';
  errorMessage = '';
  successMessage = '';
  currentUserName = 'Usuario';

  constructor(
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private authService: AuthService
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserName = currentUser?.name || 'Usuario';

    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGroup();
  }

  loadGroup() {
    this.group = this.groupsService.getGroupById(this.groupId);
  }

  addMember() {
    if (!this.group) return;

    this.errorMessage = '';
    this.successMessage = '';

    const ok = this.groupsService.addMember(this.group.id, this.newMemberName);

    if (!ok) {
      this.errorMessage = 'No se pudo agregar la persona';
      return;
    }

    this.newMemberName = '';
    this.successMessage = 'Persona agregada correctamente';
    this.loadGroup();
  }

  sendMessage() {
    if (!this.group) return;

    this.errorMessage = '';
    this.successMessage = '';

    const ok = this.groupsService.addMessage(this.group.id, this.currentUserName, this.newMessage);

    if (!ok) {
      this.errorMessage = 'Escribe un mensaje válido';
      return;
    }

    this.newMessage = '';
    this.successMessage = 'Mensaje enviado';
    this.loadGroup();
  }
}