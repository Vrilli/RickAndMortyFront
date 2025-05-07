import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersKey = 'users';
  private sessionKey = 'currentUser';
  private platformId = inject(PLATFORM_ID);

  register(username: string, password: string, email: string): boolean {
    const users = this.getUsers();
    if (users.find((u) => u.email === email)) return false;
    users.push({ username, password, email });
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    this.login(username, password, email);

    return true;
  }

  login(username: string, password: string, email: string): boolean {
    const users = this.getUsers();
    const found = users.find(
      (u) =>
        u.username === username && u.password === password && u.email === email
    );
    if (!found) return false;
    sessionStorage.setItem(this.sessionKey, JSON.stringify(found));
    return true;
  }

  logout() {
    sessionStorage.removeItem(this.sessionKey);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem(this.sessionKey);
    }
    return false;
  }

  private getUsers(): any[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem(this.sessionKey) || 'null');
  }
}
