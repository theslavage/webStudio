import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ArticlesResponseType} from "../../../types/articles-response.type";

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

    // 👇 Преобразуем кириллицу в slug-форму, понятную backend
    categories.forEach(category => {
      const slug = this.convertCategoryToSlug(category);
      params = params.append('categories[]', slug);
    });

    return this.http.get<ArticlesResponseType>(`${environment.api}articles`, { params });
  }

  /** 👇 Простая функция перевода русских категорий в латиницу */
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
