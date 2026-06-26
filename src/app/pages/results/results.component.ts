import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { University } from '../../models/university.interface';
import { UniversityService } from '../../services/university.service';
import { FavoritesService } from '../../services/favorites.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  universities: University[] = [];
  filtered: University[] = [];
  paginated: University[] = [];
  loading = false;
  error = '';
  country = '';
  filterText = '';
  sortOrder: 'az' | 'za' = 'az';
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  favoritesMap: Record<string, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private uniService: UniversityService,
    private favService: FavoritesService,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['country']) {
        this.country = params['country'];
        this.load();
      }
    });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.universities = [];
    this.filtered = [];
    this.uniService.searchByCountry(this.country).subscribe({
      next: (data) => {
        this.universities = data;
        this.historyService.add(this.country, data.length);
        this.buildFavMap();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao buscar dados. Verifique sua conexão e tente novamente.';
        this.loading = false;
      }
    });
  }

  buildFavMap(): void {
    this.favoritesMap = {};
    this.universities.forEach(u => {
      this.favoritesMap[u.name] = this.favService.isFavorite(u);
    });
  }

  applyFilters(): void {
    let result = [...this.universities];
    if (this.filterText.trim()) {
      const t = this.filterText.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(t));
    }
    if (this.sortOrder === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    this.filtered = result;
    this.currentPage = 1;
    this.totalPages = Math.max(1, Math.ceil(result.length / this.pageSize));
    this.updatePage();
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginated = this.filtered.slice(start, start + this.pageSize);
  }

  changePage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.currentPage = p;
      this.updatePage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  toggleFavorite(u: University): void {
    this.favService.toggle(u);
    this.favoritesMap[u.name] = this.favService.isFavorite(u);
  }

  openSite(url: string): void {
    window.open(url, '_blank');
  }

  get uniqueDomains(): number {
    return new Set(this.universities.flatMap(u => u.domains)).size;
  }

  get favCount(): number {
    return this.favService.count();
  }

  search(): void {
    if (this.country.trim()) {
      this.router.navigate(['/results'], { queryParams: { country: this.country.trim() } });
    }
  }
}
