import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../services/rickandmorty.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css'],
})
export class CharactersComponent implements OnInit {
  allCharacters: any[] = [];
  filteredCharacters: any[] = [];
  pagedCharacters: any[] = [];
  favoriteCharacters: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  statuses: string[] = [];
  selectedCharacter: any = null;

  isLoading: boolean = true;
  error: string | null = null;

  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private ramService: RickAndMortyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.loadCharacters();
    this.loadStatuses();
    this.loadFavorites();
  }

  private loadCharacters(): void {
    this.isLoading = true;
    this.error = null;
    this.statuses = ['alive', 'dead', 'unknown'];

    this.ramService.getAllCharacters().subscribe({
      next: (data: any[]) => {
        this.allCharacters = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching characters', err);
        this.error = 'Error al cargar los personajes.';
        this.isLoading = false;
      },
    });
  }

  private loadStatuses(): void {
    this.ramService.getStatusList().subscribe({
      next: (statuses: string[]) => {
        this.statuses = statuses;
      },
      error: (err) => {
        console.error('Error fetching statuses', err);
        this.statuses = [];
      },
    });
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
  filterCharacters(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredCharacters = this.allCharacters.filter((character) => {
      const matchStatus =
        !this.selectedStatus || character.status === this.selectedStatus;
      const matchSearch =
        !this.searchTerm ||
        character.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
    this.updatePagedCharacters();
  }

  addToFavorites(character: any) {
    if (!this.isFavorite(character)) {
      this.favoriteCharacters.push(character);
      this.saveFavorites();
    }
  }

  removeFromFavorites(character: any) {
    this.favoriteCharacters = this.favoriteCharacters.filter(
      (fav) => fav.id !== character.id
    );
    this.saveFavorites();
  }

  isFavorite(character: any): boolean {
    return this.favoriteCharacters.some((fav) => fav.id === character.id);
  }

  saveFavorites() {
    localStorage.setItem(
      'favoriteCharacters',
      JSON.stringify(this.favoriteCharacters)
    );
  }

  loadFavorites() {
    const storedFavorites = localStorage.getItem('favoriteCharacters');
    if (storedFavorites) {
      this.favoriteCharacters = JSON.parse(storedFavorites);
    }
  }
  updatePagedCharacters(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCharacters = this.filteredCharacters.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCharacters.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedCharacters();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedCharacters();
    }
  }

  openCharacterModal(character: any): void {
    this.selectedCharacter = character;
  }

  closeModal(): void {
    this.selectedCharacter = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
