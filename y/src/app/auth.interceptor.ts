import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';  // Import JwtHelperService to decode JWT
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ` + token)
    })
    return next.handle(modifiedReq).pipe(catchError(err => {
      if ([401, 403].includes(err.status)) {
        this.router.navigate(['/login']);
        this.toastr.info("Session Expired")
      }
      const error = err.error?.message || err.statusText;
      return throwError(() => error)
    }))
  }
}
