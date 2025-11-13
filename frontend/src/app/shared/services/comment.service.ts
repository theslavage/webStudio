import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {CommentType} from "../../../types/comment.type";
import {DefaultResponseType} from "../../../types/default-response.type";


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  /** Получить комментарии для статьи */
  getComments(articleId: string, offset = 0): Observable<{ allCount: number; comments: CommentType[] }> {
    return this.http.get<{ allCount: number; comments: CommentType[] }>(
      `${environment.api}comments?offset=${offset}&article=${articleId}`
    );
  }

  /** Добавить комментарий */
  addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    const headers = this.getAuthHeaders();
    return this.http.post<DefaultResponseType>(
      `${environment.api}comments`,
      { text, article: articleId },
      { headers }
    );
  }

  /** Получить действия пользователя для всех комментариев в статье */
  getArticleCommentActions(articleId: string): Observable<{ comment: string; action: string }[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ comment: string; action: string }[]>(
      `${environment.api}comments/article-comment-actions?articleId=${articleId}`,
      { headers }
    );
  }

  /** Применить действие: like / dislike / violate */
  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<DefaultResponseType> {
    const headers = this.getAuthHeaders();
    return this.http.post<DefaultResponseType>(
      `${environment.api}comments/${commentId}/apply-action`,
      { action },
      { headers }
    );
  }

  /** Получить заголовки авторизации */
  private getAuthHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({ 'x-auth': accessToken || '' });
  }
}
