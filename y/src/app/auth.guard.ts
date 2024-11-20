import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const token = localStorage.getItem('token');

    if (token) {
      // The user is authenticated, allow access to the route
      return true;
    } else {
      // The user is not authenticated, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
