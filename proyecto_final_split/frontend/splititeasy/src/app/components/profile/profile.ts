// Componente del perfil de usuario.
// Se encarga de:
// - cargar datos del usuario autenticado
// - mostrar la información en el formulario
// - guardar cambios del perfil
// - manejar estados de carga y errores

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
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

  // Información editable del perfil.
  profile: Profile = {
    name: '',
    email: '',
    description: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isSaving = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Al iniciar el componente,
  // carga la información del usuario actual.
  ngOnInit(): void {
    this.loadProfile();
  }

  // Obtiene los datos del usuario autenticado
  // desde AuthService y los carga en el formulario.
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

  // Guarda los cambios del perfil
  // enviando la información al backend.
  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones básicas del formulario.
    if (!this.profile.name.trim()) {
      this.errorMessage = 'El nombre es obligatorio';
      return;
    }

    if (!this.profile.email.trim()) {
      this.errorMessage = 'El correo es obligatorio';
      return;
    }

    this.isSaving = true;

    this.profileService
      .saveProfile(this.profile)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({

        // Si el guardado fue exitoso,
        // actualiza los datos y redirige.
        next: (response) => {
          if (response?.success === false) {
            this.errorMessage = response?.message || 'No se pudo guardar el perfil';
            return;
          }

          this.successMessage = 'Cambios guardados';

          if (response?.user) {
            this.profile = {
              name: response.user.name || '',
              email: response.user.email || '',
              description: response.user.description || ''
            };
          }

          setTimeout(() => {
            this.router.navigate(['/groups']);
          }, 1200);
        },

        // Manejo de errores del backend.
        error: (error) => {
          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            'Error al guardar perfil';
        }
      });
  }
}