import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { GreetingPipe } from '../../pipes/greeting-pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GreetingPipe, DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {

  isMenuOpen = false;
  today = new Date();

  // 🔹 ABRIR Menu
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // 🔹 CERRAR MENÚ
  closeMenu(): void {
    this.isMenuOpen = false;
  }

}