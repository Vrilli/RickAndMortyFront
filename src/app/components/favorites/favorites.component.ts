import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoriteCharacters: any[] = [];
  favoriteEpisodes: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  loadFavorites() {
    const storedCharacters = localStorage.getItem('favoriteCharacters');
    const storedEpisodes = localStorage.getItem('favoriteEpisodes');

    if (storedCharacters) {
      this.favoriteCharacters = JSON.parse(storedCharacters);
    }

    if (storedEpisodes) {
      this.favoriteEpisodes = JSON.parse(storedEpisodes);
    }
  }

  removeCharacter(character: any) {
    this.favoriteCharacters = this.favoriteCharacters.filter(
      (fav) => fav.id !== character.id
    );
    localStorage.setItem(
      'favoriteCharacters',
      JSON.stringify(this.favoriteCharacters)
    );
  }

  removeEpisode(episode: any) {
    this.favoriteEpisodes = this.favoriteEpisodes.filter(
      (fav) => fav.id !== episode.id
    );
    localStorage.setItem(
      'favoriteEpisodes',
      JSON.stringify(this.favoriteEpisodes)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
