import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  private apiURL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAllCharacters() {
    return this.http.get<any[]>(`${this.apiURL}/character`);
  }
  getCharacter(id: number) {
    return this.http.get<any>(`${this.apiURL}/character/${id}`);
  }
  getAllEpisodes() {
    return this.http.get<any[]>(`${this.apiURL}/episode`);
  }
  getEpisodeById(id: number) {
    return this.http.get<any>(`${this.apiURL}/episode/${id}`);
  }
  getStatusList() {
    return this.getAllCharacters();
  }
  getCharacterByUrl(url: string) {
    return this.http.get<any>(url);
  }
  getCharactersFiltered(
    status: string = '',
    name: string = '',
    page: number = 1
  ) {
    let url = `${this.apiURL}/character?page=${page}`;
    if (status) url += `&status=${status}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    return this.http.get(url);
  }
  getCharactersByIds(ids: number[]) {
    if (!ids.length) return of([]);
    const url = `${this.apiURL}/character/${ids.join(',')}`;
    return this.http.get<any[]>(url);
  }

  getEpisodesByIds(ids: number[]) {
    if (!ids.length) return of([]);
    const url = `${this.apiURL}/episode/${ids.join(',')}`;
    return this.http.get<any[]>(url);
  }
  getEpisodesFiltered(name: string = '', page: number = 1) {
    let url = `${this.apiURL}/episode?page=${page}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    return this.http.get(url);
  }
  
}
