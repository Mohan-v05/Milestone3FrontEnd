import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  loggedInUser: string = '';  // Default value

  isSidebarOpen: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.LoggedinUser();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the sidebar open/close state
  }

  LoggedinUser() {
    const token = localStorage.getItem('token') || '';
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);  // Decode the token and cast to your custom interface
        console.log(decodedToken);  // Log the decoded token to inspect it
        this.loggedInUser = decodedToken.Name || 'Guest';  // Access 'Name' instead of 'name'
      } catch (error) {
        console.error('Error decoding token:', error);  // Handle errors in case of invalid token
      }
    }
  }

  logOut(): void {
    // Remove the JWT token from localStorage
    console.log("Button Works");
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}


interface DecodedToken extends JwtPayload {
  Name?: string; 
  Role:string;
}
