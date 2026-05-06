import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, Profile } from '../../services/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent {
  profile: Profile;
  errorMessage = '';
  successMessage = '';

  constructor(private profileService: ProfileService) {
    this.profile = this.profileService.getProfile();
  }

  saveProfile() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.profile.name.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return;
    }

    if (!this.profile.email.trim()) {
      this.errorMessage = 'El correo es obligatorio';
      return;
    }

    this.profileService.saveProfile(this.profile);
    this.successMessage = 'Perfil guardado correctamente';
  }
}