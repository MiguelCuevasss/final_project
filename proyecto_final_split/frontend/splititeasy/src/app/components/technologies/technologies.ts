import { Component } from '@angular/core';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.html',
  styleUrls: ['./technologies.css']
})

export class TechnologiesComponent {

  technologies = [
    {
      name: 'Angular',
      desc: 'Framework principal para el frontend'
    },
    {
      name: 'TypeScript',
      desc: 'Tipado fuerte y mejor escalabilidad'
    },
    {
      name: 'CSS',
      desc: 'Diseño moderno y responsive'
    },
    {
      name: 'Node.js',
      desc: 'Entorno de ejecución'
    }
  ];

}