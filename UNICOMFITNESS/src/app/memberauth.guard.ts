import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  Role: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('token') || '';

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const role = decodedToken.Role;

      if (role === 'Admin' || role === 'Member') {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Token decoding failed', error);
      this.router.navigate(['/login']);
      return false;
    }
  }

}
