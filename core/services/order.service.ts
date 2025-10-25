// src/app/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IOrder } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = environment.apiUrl + 'orders';

  constructor(private http: HttpClient) {}

  /** Create Order (User) */
  createOrder(addressLabel: string): Observable<{ message: string; order: IOrder }> {
    return this.http.post<{ message: string; order: IOrder }>(`${this.apiUrl}`, { addressLabel });
  }

  /** Get all orders user */
  getUserOrders(): Observable<{ orders: IOrder[] }> {
    return this.http.get<{ orders: IOrder[] }>(`${this.apiUrl}`);
  }

  /** Get single order by ID */
  getOrderById(id: string): Observable<{ order: IOrder }> {
    return this.http.get<{ order: IOrder }>(`${this.apiUrl}/${id}`);
  }

  /** Cancel order by user */
  cancelOrderByUser(id: string): Observable<{ message: string; order: IOrder }> {
    return this.http.patch<{ message: string; order: IOrder }>(`${this.apiUrl}/${id}/cancel`, {});
  }


  /** Get all orders */
  getAllOrders(): Observable<{ orders: IOrder[] }> {
    return this.http.get<{ orders: IOrder[] }>(`${this.apiUrl}/admin/all`);
  }

  /** Update order status */
  updateOrderStatus(id: string, newStatus: string): Observable<{ message: string; order: IOrder }> {
    return this.http.patch<{ message: string; order: IOrder }>(
      `${this.apiUrl}/admin/${id}/status`,
      { newStatus }
    );
  }

  /** Cancel order */
  cancelOrderByAdmin(id: string): Observable<{ message: string; order: IOrder }> {
    return this.http.patch<{ message: string; order: IOrder }>(
      `${this.apiUrl}/admin/${id}/cancel`,
      {}
    );
  }
}
