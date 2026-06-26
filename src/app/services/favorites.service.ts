import { Injectable } from '@angular/core';
import { University } from '../models/university.interface';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private storageKey = 'au_favorites';

  getFavorites(): University[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  isFavorite(university: University): boolean {
    return this.getFavorites().some(u => u.name === university.name && u.country === university.country);
  }

  toggle(university: University): void {
    const favorites = this.getFavorites();
    const idx = favorites.findIndex(u => u.name === university.name && u.country === university.country);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(university);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  remove(university: University): void {
    const favorites = this.getFavorites().filter(
      u => !(u.name === university.name && u.country === university.country)
    );
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  count(): number {
    return this.getFavorites().length;
  }
}
