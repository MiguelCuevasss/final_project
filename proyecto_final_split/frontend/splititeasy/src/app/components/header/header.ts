import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  isMenuOpen = false;

  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menú abierto:', this.isMenuOpen);
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}