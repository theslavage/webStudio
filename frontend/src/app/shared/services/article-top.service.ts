import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ArticleTopService {

  constructor(private http: HttpClient) {
  }

  getTopCategories(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(`${environment.api}articles/top`);
  }

}
