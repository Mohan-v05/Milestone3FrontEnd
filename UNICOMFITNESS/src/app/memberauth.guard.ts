
interface DecodedToken extends JwtPayload {
  Name?: string; 
  Role:string;
}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class memberauthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      const token = localStorage.getItem('token')||'';
       const decodedToken:DecodedToken = jwtDecode(token)
     const Role=decodedToken.Role
     
      
    if (Role=='Admin'||Role=='Member') {
      
      return true;
    } else {
     
      this.router.navigate(['/login']);
      return false;
    }
  }
}
