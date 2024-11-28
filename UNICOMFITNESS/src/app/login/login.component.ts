import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GymManagementSystemService } from '../gym-management-system.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {jwtDecode, JwtPayload} from 'jwt-decode'; // Import jwt-decode
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RegisterComponent } from '../Register/register/register.component';

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
  bsModalRef?: BsModalRef;
  isLogin:boolean=true;
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private service: GymManagementSystemService,
    private toastr: ToastrService,
    private modalService:BsModalService
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
        async data => {
         await localStorage.setItem("token", data.token);
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
        const decodedToken = jwtDecode<DecodedToken>(token);  
        console.log(decodedToken);  
    
        
        // Navigate based on the role
        if (decodedToken.Role === 'Admin') {
          this.route.navigate(['/admin/Dashboard'], { queryParams: { adminId: decodedToken.Id } });
         // this.route.navigate(['/admin/Dashboard']);
        } else if (decodedToken.Role === 'Member') {
          this.route.navigate(['/member']);
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

  openModalWithComponent() {
    const initialState: ModalOptions = {
      initialState: {
        list: ['Open a modal with component', 'Pass your data', 'Do something else', '...'],
        title: 'Modal with component'
      }
    };
    this.bsModalRef = this.modalService.show(RegisterComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.isLogin=false;
  }
}

interface DecodedToken extends JwtPayload {
  Name?: string; 
  Role:string;
  Id:number;
}
