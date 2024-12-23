import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      const token = localStorage.getItem('token')||'';
       const decodedToken:DecodedToken = jwtDecode(token)
     const Role=decodedToken.Role
     
      
    if (Role=='Admin') {
      
      return true;
    } else {
     
      this.router.navigate(['/login']);
      return false;
    }
  }
}
interface DecodedToken extends JwtPayload {
  Name?: string; 
  Role:string;
}
