import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IFqa } from '../interfaces/fqa.interface';

@Injectable({
  providedIn: 'root'
})
export class FqaService {
  private readonly apiUrl = environment.apiUrl + 'fqa';

  constructor(private http: HttpClient) {}

  /** Get all active FAQs */
  getActiveFAQs(): Observable<{ success: boolean; count: number; faqs: IFqa[] }> {
    return this.http.get<{ success: boolean; count: number; faqs: IFqa[] }>(`${this.apiUrl}`);
  }

  /** Get all FAQs (active + inactive) */
  getAllFAQs(): Observable<{ success: boolean; count: number; faqs: IFqa[] }> {
    return this.http.get<{ success: boolean; count: number; faqs: IFqa[] }>(`${this.apiUrl}/all`);
  }

  /** Create new FAQ */
  createFAQ(data: { question: string; answer: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  /** Update an existing FAQ */
  updateFAQ(id: string, data: Partial<IFqa>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /** Delete an FAQ */
  deleteFAQ(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Toggle FAQ active status */
  toggleFAQStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle`, {});
  }
}
