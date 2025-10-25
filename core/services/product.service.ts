import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl + 'products';

  constructor(private http: HttpClient) {}

  /** Get Featured Products */
  getFeaturedProducts(filters?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    tag?: string;
  }): Observable<{ status: string; results: number; data: Product[] }> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }

    return this.http.get<{ status: string; results: number; data: Product[] }>(
      `${this.apiUrl}`,
      { params }
    );
  }

  /** Get All Products (Admin only) */
  getAllProducts(filters?: {
    category?: string;
    brand?: string;
    search?: string;
    tag?: string;
  }): Observable<{ status: string; results: number; data: Product[] }> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }

    return this.http.get<{ status: string; results: number; data: Product[] }>(
      `${this.apiUrl}/all`,
      { params }
    );
  }

  /** Get Single Product by ID or Slug */
  getProduct(idOrSlug: string): Observable<{ status: string; data: Product }> {
    return this.http.get<{ status: string; data: Product }>(
      `${this.apiUrl}/${idOrSlug}`
    );
  }

  /** Get Products by Category */
  getProductsByCategory(categoryId: string): Observable<{ status: string; results: number; data: Product[] }> {
    return this.http.get<{ status: string; results: number; data: Product[] }>(
      `${this.apiUrl}/category/${categoryId}`
    );
  }

  /** Create Product (Admin only) */
  createProduct(formData: FormData): Observable<{ status: string; data: Product }> {
    return this.http.post<{ status: string; data: Product }>(
      this.apiUrl,
      formData
    );
  }

  /** Update Product (Admin only) */
  updateProduct(id: string, formData: FormData): Observable<{ status: string; data: Product }> {
    return this.http.patch<{ status: string; data: Product }>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  /** Soft Delete Product (Admin only) */
  deleteProduct(id: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(
      `${this.apiUrl}/${id}`
    );
  }

  /** Toggle Featured (Admin only) */
  toggleFeatured(id: string): Observable<{ status: string; message: string; data: Product }> {
    return this.http.patch<{ status: string; message: string; data: Product }>(
      `${this.apiUrl}/${id}/featured`,
      {}
    );
  }
}
