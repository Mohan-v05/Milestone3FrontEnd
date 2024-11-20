import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
 
  constructor(private router:Router){

  }

  loggedInUser:string="mohan"
  isSidebarOpen: boolean = true; 
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the sidebar open/close state
  }

  logOut(): void {
    // Remove the JWT token from localStorage
    console.log("Button Works")
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  
}
}
