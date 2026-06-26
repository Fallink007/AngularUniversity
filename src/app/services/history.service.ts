import { Injectable } from '@angular/core';
import { SearchHistory } from '../models/university.interface';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private storageKey = 'au_history';

  getHistory(): SearchHistory[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  add(country: string, count: number): void {
    const history = this.getHistory();
    const entry: SearchHistory = {
      country,
      date: new Date().toLocaleString('pt-BR'),
      count
    };
    history.unshift(entry);
    const limited = history.slice(0, 10);
    localStorage.setItem(this.storageKey, JSON.stringify(limited));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
