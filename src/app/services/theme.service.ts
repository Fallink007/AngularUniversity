import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    this.darkMode.next(isDark);
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  toggle(): void {
    const next = !this.darkMode.value;
    this.darkMode.next(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.body.setAttribute('data-theme', next ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.darkMode.value;
  }
}
