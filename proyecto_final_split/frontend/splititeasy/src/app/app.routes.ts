import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { UpgradeComponent } from './components/upgrade/upgrade';

export const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'upgrade', component: UpgradeComponent }
];