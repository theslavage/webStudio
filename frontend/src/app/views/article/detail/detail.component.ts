import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../shared/services/article.service';
import { ArticleDetailResponseType } from '../../../../types/article-detail-response.type';
import { environment } from '../../../../environments/environment';
import { ArticleType } from '../../../../types/article.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  article: ArticleDetailResponseType | null = null;
  relatedArticle: ArticleType[] = [];
  isLoading = true;
  serverStaticPath = environment.serverStaticPath;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const url = params.get('url');
      if (url) {
        this.loadArticle(url);
      }
    });
  }

  /** Загрузка основной статьи */
  private loadArticle(url: string): void {
    this.articleService.getArticleByUrl(url).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;

        // После загрузки основной статьи — загружаем связанные
        this.loadRelatedArticles(url);
      },
      error: (err) => {
        console.error('Ошибка при загрузке статьи', err);
        this.isLoading = false;
      }
    });
  }

  /** Загрузка связанных статей */
  private loadRelatedArticles(url: string): void {
    this.articleService.getRelatedArticles(url).subscribe({
      next: (data) => {
        this.relatedArticle = data.slice(0, 2); // максимум две статьи
      },
      error: (err) => {
        console.error('Ошибка при загрузке связанных статей', err);
      }
    });
  }
}
