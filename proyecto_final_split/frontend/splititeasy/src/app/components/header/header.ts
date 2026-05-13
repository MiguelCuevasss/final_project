// Componente del header principal.
// Se encarga de:
// - mostrar información del usuario actual
// - controlar el menú responsive
// - mostrar fecha y saludo dinámico
// - escuchar cambios de sesión desde AuthService

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GreetingPipe } from '../../pipes/greeting-pipe';
import { AuthService, CurrentUser } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, GreetingPipe, DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  today = new Date();
  currentUserName = 'usuario';

  private userSub?: Subscription;

  constructor(private authService: AuthService) {}

  // Al iniciar el componente:
  // se suscribe al usuario actual para mantener
  // actualizado el nombre mostrado en el header.
  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe((user: CurrentUser | null) => {
      this.currentUserName = user?.name || 'usuario';
    });
  }

  // Limpia la suscripción para evitar
  // fugas de memoria cuando el componente se destruye.
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  // Abre o cierra el menú responsive.
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Cierra el menú móvil manualmente.
  closeMenu(): void {
    this.isMenuOpen = false;
  }
}