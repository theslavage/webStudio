import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ArticlesResponseType} from "../../../types/articles-response.type";
import {ArticleDetailResponseType} from "../../../types/article-detail-response.type";
import {CommentType} from "../../../types/comment.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getTopCategories(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(`${environment.api}articles/top`);
  }

  getCategories(page: number = 1, categories: string[] = []): Observable<ArticlesResponseType> {
    let params = new HttpParams().set('page', page);

    categories.forEach(category => {
      const slug = this.convertCategoryToSlug(category);
      params = params.append('categories[]', slug);
    });

    return this.http.get<ArticlesResponseType>(`${environment.api}articles`, { params });
  }

  getArticleByUrl(url: string): Observable<ArticleDetailResponseType> {
    return this.http.get<ArticleDetailResponseType>(`${environment.api}articles/${url}`);
  }

  getRelatedArticles(url: string) {
    return this.http.get<ArticleType[]>(`${environment.api}articles/related/${url}`);
  }

  getComments(articleId: string, offset = 0, limit = 3) {
    return this.http.get<{
      allCount: number;
      comments: CommentType[];
    }>(
      `${environment.api}comments?article=${articleId}&offset=${offset}&limit=${limit}`
    );
  }

  private convertCategoryToSlug(category: string): string {
    const map: Record<string, string> = {
      'Фриланс': 'frilans',
      'Дизайн': 'dizain',
      'SMM': 'smm',
      'Таргет': 'target',
      'Копирайтинг': 'kopiraiting'
    };
    return map[category] || category.toLowerCase();
  }
}
