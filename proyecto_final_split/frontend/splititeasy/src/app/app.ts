// Componente raíz de la aplicación Angular.
// Se encarga de cargar:
// - el header principal
// - las rutas dinámicas mediante RouterOutlet

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

// Nombre principal de la app.
  protected readonly title = signal('splititeasy');
}