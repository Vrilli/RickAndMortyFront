import { Routes } from '@angular/router';
import { CharactersComponent } from './components/characters/characters.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'characters', component: CharactersComponent },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./components/episodes/episodes.component').then(
        (m) => m.EpisodesComponent
      ),
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
  },
];
