// Definición de rutas principales de Angular.
// Este archivo controla la navegación entre:
// - grupos
// - detalle de grupo
// - login y registro
// - perfil
// - tecnologías
// - upgrade

import { Routes } from '@angular/router';
import { UpgradeComponent } from './components/upgrade/upgrade';
import { TechnologiesComponent } from './components/technologies/technologies';
import { LoginComponent } from './components/login/login';
import { GroupsComponent } from './components/groups/groups';
import { GroupDetailComponent } from './components/group-detail/group-detail';
import { ProfileComponent } from './components/profile/profile';


export const routes: Routes = [

  // Redirección inicial hacia grupos.
  { path: '', redirectTo: 'groups', pathMatch: 'full' },

  // Vista principal de grupos y chat IA.
  { path: 'groups', component: GroupsComponent },

  // Vista detalle de un grupo específico.
  { path: 'groups/:id', component: GroupDetailComponent },

  // Vista de planes y upgrade.
  { path: 'upgrade', component: UpgradeComponent },

  // Vista informativa de tecnologías.
  { path: 'technologies', component: TechnologiesComponent },

  // Vista de login.
  { path: 'login', component: LoginComponent },

  // Vista de perfil del usuario.
  { path: 'perfil', component: ProfileComponent },

  // Vista de registro reutilizando LoginComponent.
  { path: 'registro', component: LoginComponent}
];