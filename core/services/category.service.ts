import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl + 'categories'; // 🔹 Base URL of your backend

  constructor(private http: HttpClient) {}

  /** Get all categories (public + admin view) */
  getAllCategories(): Observable<{ status: string; results: number; data: Category[] }> {
    return this.http.get<{ status: string; results: number; data: Category[] }>(this.apiUrl);
  }

  /** Get a single category by ID or slug */
  getCategory(id: string): Observable<{ status: string; data: Category }> {
    return this.http.get<{ status: string; data: Category }>(`${this.apiUrl}/${id}`);
  }

  /** Create a new category (Admin only) */
  createCategory(formData: FormData): Observable<{ status: string; data: Category }> {
    return this.http.post<{ status: string; data: Category }>(this.apiUrl, formData);
  }

  /** Update category (Admin only) */
  updateCategory(id: string, formData: FormData): Observable<{ status: string; data: Category }> {
    return this.http.patch<{ status: string; data: Category }>(`${this.apiUrl}/${id}`, formData);
  }

  /** Toggle category active/inactive (Admin only) */
  toggleCategoryActive(id: string): Observable<{ status: string; message: string; data: Category }> {
    return this.http.patch<{ status: string; message: string; data: Category }>(
      `${this.apiUrl}/${id}/toggle`,
      {}
    );
  }

  /** Delete category (Admin only, soft delete) */
  deleteCategory(id: string): Observable<{ status: string; message: string; data: Category }> {
    return this.http.delete<{ status: string; message: string; data: Category }>(`${this.apiUrl}/${id}`);
  }
}
