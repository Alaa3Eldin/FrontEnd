import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICart } from '../interfaces/cart.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = environment.apiUrl + 'cart';

  constructor(private http: HttpClient) {}

  /** Get current user's cart */
  getUserCart(): Observable<{ cart: ICart | null; message?: string }> {
    return this.http.get<{ cart: ICart | null; message?: string }>(`${this.apiUrl}`);
  }

  /** Add item to cart */
  addToCart(productId: string, quantity: number): Observable<{ cart: ICart; message: string }> {
    return this.http.post<{ cart: ICart; message: string }>(`${this.apiUrl}`, { productId, quantity });
  }

  /** Update item quantity */
  updateItemQuantity(productId: string, quantity: number): Observable<{ cart: ICart; message: string }> {
    return this.http.patch<{ cart: ICart; message: string }>(`${this.apiUrl}/update`, { productId, quantity });
  }

  /** Remove item from cart */
  removeItem(productId: string): Observable<{ cart: ICart; message: string }> {
    return this.http.delete<{ cart: ICart; message: string }>(`${this.apiUrl}/remove/${productId}`);
  }

  /** Clear entire cart */
  clearCart(): Observable<{ cart: ICart; message: string }> {
    return this.http.delete<{ cart: ICart; message: string }>(`${this.apiUrl}/clear`);
  }

  /** Check for price changes */
  checkPriceChanges(): Observable<{ cart: ICart; message: string }> {
    return this.http.get<{ cart: ICart; message: string }>(`${this.apiUrl}/check-prices`);
  }

  /** Confirm updated prices after user approval */
  confirmUpdatedPrices(): Observable<{ cart: ICart; message: string }> {
    return this.http.post<{ cart: ICart; message: string }>(`${this.apiUrl}/confirm-prices`, {});
  }
}
