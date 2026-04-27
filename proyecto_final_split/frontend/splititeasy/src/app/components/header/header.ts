import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GreetingPipe } from '../../pipes/greeting-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, GreetingPipe, DatePipe],
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

  today = new Date();

}