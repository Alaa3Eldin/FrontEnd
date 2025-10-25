import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ITestimonial } from '../interfaces/testimonial.interface';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private readonly apiUrl = environment.apiUrl + 'testimonials';

  constructor(private http: HttpClient) {}

  /** Get all approved testimonials */
  getApprovedTestimonials(): Observable<{ count: number; testimonials: ITestimonial[] }> {
    return this.http.get<{ count: number; testimonials: ITestimonial[] }>(`${this.apiUrl}`);
  }

  /** Get featured testimonials */
  getFeaturedTestimonials(): Observable<{ count: number; testimonials: ITestimonial[] }> {
    return this.http.get<{ count: number; testimonials: ITestimonial[] }>(`${this.apiUrl}/featured`);
  }

  /** Create a new testimonial */
  createTestimonial(data: { message: string; rating: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  /** Get my own testimonials */
  getMyTestimonials(): Observable<{ count: number; testimonials: ITestimonial[] }> {
    return this.http.get<{ count: number; testimonials: ITestimonial[] }>(`${this.apiUrl}/my`);
  }

  /** Get all testimonials */
  getAllTestimonials(): Observable<{ count: number; testimonials: ITestimonial[] }> {
    return this.http.get<{ count: number; testimonials: ITestimonial[] }>(`${this.apiUrl}/admin/all`);
  }

  /**  Approve testimonial */
  approveTestimonial(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/${id}/approve`, {});
  }

  /** Toggle featured status */
  toggleFeatured(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/${id}/toggle-featured`, {});
  }

  /** Delete testimonial */
  deleteTestimonial(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/${id}`);
  }
}
