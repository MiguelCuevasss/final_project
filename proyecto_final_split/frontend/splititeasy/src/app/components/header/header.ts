import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { GreetingPipe } from '../../pipes/greeting-pipe';
import { ChatService } from '../../services/chat';

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

  userMessage: string = '';
  aiResponse: string = '';

  constructor(private chatService: ChatService) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  sendMessage(): void {
  console.log(this.userMessage);

  if (!this.userMessage.trim()) return;

  this.chatService.sendMessage(this.userMessage).subscribe({
    next: (response) => {
      this.aiResponse = response.aiResponse;
    },
    error: (error) => {
      console.error(error);
      this.aiResponse = 'Hubo un error al comunicarse con la IA.';
    }
  });
}
}