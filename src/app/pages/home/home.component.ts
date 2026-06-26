import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../services/history.service';
import { SearchHistory } from '../../models/university.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  country: string = '';
  history: SearchHistory[] = [];
  countries: string[] = [
    'Brazil', 'United States', 'Canada', 'Australia', 'Germany',
    'Japan', 'France', 'United Kingdom', 'Portugal', 'Argentina',
    'Italy', 'Spain', 'Mexico', 'India', 'China'
  ];

  constructor(private router: Router, private historyService: HistoryService) {}

  ngOnInit(): void {
    this.history = this.historyService.getHistory();
  }

  search(): void {
    if (this.country.trim()) {
      this.router.navigate(['/results'], { queryParams: { country: this.country.trim() } });
    }
  }

  searchFromHistory(country: string): void {
    this.country = country;
    this.search();
  }

  clearHistory(): void {
    this.historyService.clear();
    this.history = [];
  }
}
