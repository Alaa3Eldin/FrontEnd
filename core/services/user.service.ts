import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser, IAddress } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl + 'users';

  constructor(private http: HttpClient) {}

  // Get me
  getMe(): Observable<{ status: string; data: IUser }> {
    return this.http.get<{ status: string; data: IUser }>(`${this.apiUrl}/me`);
  }


  // Get all users (Admin only)
  getAllUsers(): Observable<{ status: string; results: number; data: IUser[] }> {
    return this.http.get<{ status: string; results: number; data: IUser[] }>(
      `${this.apiUrl}/admin/all`
    );
  }

  // Update user profile
  updateProfile(data: Partial<IUser>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data);
  }

  // Add a new address
  addAddress(address: IAddress): Observable<any> {
    return this.http.post(`${this.apiUrl}/addresses`, address);
  }

  // Update an existing address
  updateAddress(addressId: string, updates: Partial<IAddress>): Observable<any> {
    return this.http.put(`${this.apiUrl}/addresses/${addressId}`, updates);
  }

  // Delete an address
  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/addresses/${addressId}`);
  }

  // Soft delete account
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-account`);
  }

  // toggle user active status
  toggleUserStatus(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/toggle-active/${userId}`, {});
  }
}
