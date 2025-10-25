import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
    const _router = inject(Router);
  const _auth = inject(AuthService);
  return next(req).pipe(
    catchError((error) => {
      console.log(error);
      if(error.status === 401){
        _auth.logout();
        _router.navigate(['/']);
      }else if(error.status === 403){
        //you are not admin or user
        _router.navigate(['/unauthorized']);
      }else if(error.status === 404){
        _router.navigate(['/not-found']);
      }else if(error.status === 500){
        _router.navigate(['/server-error']);
      }
      else{
        _router.navigate(['/server-error']);
      }
      return throwError(()=>error);
    })
  );
};
