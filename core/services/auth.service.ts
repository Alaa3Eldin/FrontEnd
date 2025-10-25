import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IAuthResponse, ILogin, IRegister, ITokenDecode } from '../interfaces/auth.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private _router = inject(Router);
  private readonly apiUrl = environment.apiUrl + 'auth';
  private authName = new BehaviorSubject<string | null>(null);
  authName$ = this.authName.asObservable();

  private token_key = 'token';

  private storeToken(token: string) {
    localStorage.setItem(this.token_key, token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.token_key);
  }
  private decodeToken(token: string) {
    const decode = jwtDecode<ITokenDecode>(token);
    return decode;
  }
  private removeToken() {
    localStorage.removeItem(this.token_key);
  }

  register(registerData: IRegister) {
    return this.httpClient.post<IAuthResponse>(`${this.apiUrl}/register`, registerData).pipe(
      tap((res) => {
        this.storeToken(res.token);
        this.authName.next(this.decodeToken(res.token).name);
        if (this.decodeToken(res.token).role === 'admin') {
          this._router.navigate(['/dashboard']);
        } else if (this.decodeToken(res.token).role === 'user'){
          this._router.navigate(['/']);
        } else {
          this._router.navigate(['/']);
        }
      })
    );
  }


  login(loginData: ILogin) {
    return this.httpClient.post<IAuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((res) => {
        this.storeToken(res.token);
        this.authName.next(this.decodeToken(res.token).name);
        if (this.decodeToken(res.token).role === 'admin') {
          this._router.navigate(['/dashboard']);
        }else if (this.decodeToken(res.token).role === 'user') {
          this._router.navigate(['/']);
        }
        else {
          this._router.navigate(['/']);
        }
      })
    );
  }

  isLoggedIn() {
    const token = this.getToken();

    if (token) {
      if (this.isValidToken(token)) {
        this.authName.next(this.decodeToken(token).name);
      } else {
        this.authName.next(null);
        this.logout();
      }
    } else {
      this.authName.next(null);
    }
  }

  logout() {
    this.removeToken()
    this.authName.next(null);
    this._router.navigate(['/login']);
  }

  private isValidToken(token: string) {
    try {
      const decode = this.decodeToken(token);
      if (decode.exp < Date.now() / 1000) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  isLoggedInWithRole(role: string) {
    const token = this.getToken();
    if (token) {
      if (this.isValidToken(token)) {
        const decode = this.decodeToken(token);
        if (decode.role === role) {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
    return false;
  }

      //  Register new admin
  registerAdmin(data: { name: string; email: string; password: string; phone?: string }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/register/admin`, data);
  }
}
