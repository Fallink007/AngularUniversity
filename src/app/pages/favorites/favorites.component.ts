import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { University } from '../../models/university.interface';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favorites: University[] = [];
  filterText = '';
  sortOrder: 'az' | 'za' = 'az';

  constructor(private favService: FavoritesService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.favorites = this.favService.getFavorites();
  }

  remove(u: University): void {
    this.favService.remove(u);
    this.load();
  }

  openSite(url: string): void {
    window.open(url, '_blank');
  }

  get filtered(): University[] {
    let result = [...this.favorites];
    if (this.filterText.trim()) {
      const t = this.filterText.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(t));
    }
    if (this.sortOrder === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    return result;
  }
}
