import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DefaultResponse, OrderRequest} from "../../../types/order.type";

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient) {}

  sendOrder(data: OrderRequest): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(this.apiUrl, data);
  }
}
