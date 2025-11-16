import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  constructor(private http: HttpClient) {}

  addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    const headers = this.getAuthHeaders();
    return this.http.post<DefaultResponseType>(
      `${environment.api}comments`,
      { text, article: articleId },
      { headers }
    );
  }

  getArticleCommentActions(articleId: string): Observable<{ comment: string; action: string }[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ comment: string; action: string }[]>(
      `${environment.api}comments/article-comment-actions?articleId=${articleId}`,
      { headers }
    );
  }

  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<DefaultResponseType> {
    const headers = this.getAuthHeaders();
    return this.http.post<DefaultResponseType>(
      `${environment.api}comments/${commentId}/apply-action`,
      { action },
      { headers }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({ 'x-auth': accessToken || '' });
  }
}
