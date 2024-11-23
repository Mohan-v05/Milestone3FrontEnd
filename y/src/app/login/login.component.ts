import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GymManagementSystemService } from '../gym-management-system.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: string = '';
  emailError: boolean = false;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private service: GymManagementSystemService,
    private toastr: ToastrService,
    
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  openModal() {
    const modalElement = document.getElementById('forgetPasswordModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  submitForm() {
    if (this.isValidEmail(this.email)) {
      this.emailError = false;
      console.log('Form Submitted', this.email);
    } else {
      this.emailError = true;
    }
  }

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form Submitted', formData);
      
      this.service.login(formData).subscribe(
        data => {
          localStorage.setItem("token", data.token);
          this.routeBasedOnRole();
        },
        err => {
          // Handle errors based on backend response
          if (err.error && err.error.message) {
            const backendMessage = err.error.message.toLowerCase();
            if (backendMessage.includes("user not found")) {
              this.toastr.error("User not found. Please register or check your email.");
            } else if (backendMessage.includes("incorrect password")) {
              this.toastr.error("Incorrect password. Please try again.");
            } else {
              this.toastr.error("An unexpected error occurred. Please try again later.");
            }
          } else {
            // Generic error handling
            this.toastr.error("Unable to process your request. Check your network connection.");
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  // Routing Based on Role after Login
  routeBasedOnRole() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        const userRole = decodedToken.Role 
        
        // Navigate based on the role
        if (userRole === 'Admin') {
          this.route.navigate(['/admin/Dashboard']);
        } else if (userRole === 'Member') {
          this.route.navigate(['/member-dashboard']);
        } else {
          this.route.navigate(['/unauthorized']);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.route.navigate(['/login']);
      }
    } else {
      this.route.navigate(['/login']); // Redirect to login if no token found
    }
  }
}
