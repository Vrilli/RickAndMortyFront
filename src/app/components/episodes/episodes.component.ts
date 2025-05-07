import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../services/rickandmorty.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.css'],
})
export class EpisodesComponent implements OnInit {
  allEpisodes: any[] = [];
  episodes: any[] = [];
  favoriteEpisodes: any[] = [];
  pagedEpisodes: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  selectedSeason: string = '';
  seasons: string[] = [];

  selectedEpisode: any = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(
    private ramService: RickAndMortyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ramService
      .getAllEpisodes()
      .pipe(
        switchMap((episodes: any[]) => {
          const episodeRequests = episodes.map((ep) => {
            if (ep.characters && ep.characters.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * ep.characters.length
              );
              const randomCharUrl = ep.characters[randomIndex];
              return this.ramService.getCharacterByUrl(randomCharUrl).pipe(
                map((character) => ({
                  ...ep,
                  firstCharacter: {
                    ...character,
                    origin: character.origin?.name,
                  },
                })),
                catchError((error) => {
                  console.error(
                    `Error loading character for episode ${ep.id}`,
                    error
                  );
                  return of({ ...ep, firstCharacter: null });
                })
              );
            } else {
              return of({ ...ep, firstCharacter: null });
            }
          });
          return forkJoin(episodeRequests);
        })
      )
      .subscribe({
        next: (updatedEpisodes: any[]) => {
          this.allEpisodes = updatedEpisodes;
          this.episodes = updatedEpisodes;
          this.seasons = Array.from(
            new Set(
              updatedEpisodes
                .filter((ep) => ep.episodeCode)
                .map((ep) => ep.episodeCode.substring(1, 3))
            )
          );
          this.isLoading = false;
          this.updatePagedEpisodes();
        },
        error: (err) => {
          console.error('Error fetching episodes', err);
          this.error = 'Failed to load episodes';
          this.isLoading = false;
        },
      });

    this.loadFavoriteEpisodes();
  }
  isActive(path: string): boolean {
    return this.router.url === path;
  }
  filterEpisodes(): void {
    this.episodes = this.allEpisodes.filter((episode) => {
      const season = episode.episodeCode?.substring(1, 3);
      return (
        (!this.selectedSeason || season === this.selectedSeason) &&
        (!this.searchTerm ||
          episode.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    });
    this.currentPage = 1;
    this.updatePagedEpisodes();
  }

  updatePagedEpisodes(): void {
    this.totalPages = Math.ceil(this.episodes.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedEpisodes = this.episodes.slice(start, end);
  }

  loadFavoriteEpisodes(): void {
    const stored = localStorage.getItem('favoriteEpisodes');
    if (stored) {
      this.favoriteEpisodes = JSON.parse(stored);
    }
  }

  isFavorite(episode: any): boolean {
    return this.favoriteEpisodes.some((fav) => fav.id === episode.id);
  }

  addToFavorites(episode: any): void {
    if (!this.isFavorite(episode)) {
      this.favoriteEpisodes.push(episode);
      localStorage.setItem(
        'favoriteEpisodes',
        JSON.stringify(this.favoriteEpisodes)
      );
    }
  }

  removeFromFavorites(episode: any): void {
    this.favoriteEpisodes = this.favoriteEpisodes.filter(
      (fav) => fav.id !== episode.id
    );
    localStorage.setItem(
      'favoriteEpisodes',
      JSON.stringify(this.favoriteEpisodes)
    );
  }

  toggleFavorite(episode: any): void {
    this.isFavorite(episode)
      ? this.removeFromFavorites(episode)
      : this.addToFavorites(episode);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedEpisodes();
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedEpisodes();
    }
  }

  openEpisodeModal(episode: any): void {
    this.selectedEpisode = episode;
  }

  closeModal(): void {
    this.selectedEpisode = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
