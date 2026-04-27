import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { UpgradeComponent } from './components/upgrade/upgrade';
import { TechnologiesComponent } from './components/technologies/technologies'; 
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'technologies', component: TechnologiesComponent },
  { path: 'login', component: LoginComponent }
];