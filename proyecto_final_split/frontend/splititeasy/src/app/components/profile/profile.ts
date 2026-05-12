import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, Profile } from '../../services/profile';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  profile: Profile = {
    name: '',
    email: '',
    description: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const current = this.authService.getCurrentUser();

    if (!current?.id) {
      this.errorMessage = 'No hay usuario autenticado';
      this.isLoading = false;
      return;
    }

    this.profile = {
      name: current.name || '',
      email: current.email || '',
      description: current.description || ''
    };

    this.isLoading = false;
  }

  saveProfile(): void {
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

    this.profileService.saveProfile(this.profile).subscribe({
      next: (response) => {
        this.successMessage = response?.message || 'Perfil actualizado correctamente';
        if (response?.user) {
          this.profile = {
            name: response.user.name || '',
            email: response.user.email || '',
            description: response.user.description || ''
          };
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || error?.message || 'Error al guardar perfil';
      }
    });
  }
}