import { Routes } from '@angular/router';
import { UpgradeComponent } from './components/upgrade/upgrade';
import { TechnologiesComponent } from './components/technologies/technologies';
import { LoginComponent } from './components/login/login';
import { GroupsComponent } from './components/groups/groups';
import { GroupDetailComponent } from './components/group-detail/group-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'groups', pathMatch: 'full' },
  { path: 'groups', component: GroupsComponent },
  { path: 'groups/:id', component: GroupDetailComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'technologies', component: TechnologiesComponent },
  { path: 'login', component: LoginComponent }
];