import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GroupsService, Group } from '../../services/groups';
import { AuthService } from '../../services/auth';

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

  constructor(
    private groupsService: GroupsService,
    private authService: AuthService
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
}