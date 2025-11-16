import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { ArticleService } from '../../../shared/services/article.service';
import { ArticleType } from '../../../../types/article.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  isFilterOpen = false;
  activeFilters: string[] = [];

  filters = ['Фриланс', 'Дизайн', 'SMM', 'Таргет', 'Копирайтинг'];

  pages: number[] = [];
  currentPage = 1;
  totalPages = 1;

  articles: ArticleType[] = [];

  constructor(private articleService: ArticleService,
              private eRef: ElementRef) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getCategories(this.currentPage, this.activeFilters)
      .subscribe({
        next: (data) => {
          this.articles = data.items;
          this.totalPages = data.pages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        },
        error: (err) => console.error('Ошибка при загрузке статей:', err)
      });
  }

  goToPage(page: number): void {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.loadArticles();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadArticles();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  toggleActiveFilter(filter: string): void {
    const index = this.activeFilters.indexOf(filter);

    if (index === -1) {
      this.activeFilters.push(filter);
    } else {
      this.activeFilters.splice(index, 1);
    }

    this.currentPage = 1;
    this.loadArticles();
  }

  isActive(filter: string): boolean {
    return this.activeFilters.includes(filter);
  }

  removeFilter(filter: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filter);
    this.currentPage = 1;
    this.loadArticles();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (
      this.isFilterOpen &&
      !this.eRef.nativeElement.querySelector('.blog-sorting')?.contains(event.target)
    ) {
      this.isFilterOpen = false;
    }
  }
}
