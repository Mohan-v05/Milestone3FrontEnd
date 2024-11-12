import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GymManagementSystemService } from '../gym-management-system.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {
  loginForm: FormGroup;
  email: string = '';
  emailError: boolean = false;
 
  constructor(private route:Router,
    private fb: FormBuilder,private service:GymManagementSystemService,private toastr:ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  openModal() {
    // This can be used to trigger the modal programmatically, if needed
    const modalElement = document.getElementById('forgetPasswordModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  submitForm() {
    // Basic email validation (you can add more checks as needed)
    if (this.isValidEmail(this.email)) {
      this.emailError = false;
      console.log('Form Submitted', this.email);
      // Here you can call a service to handle the password reset logic.
    } else {
      this.emailError = true;
    }
  }
  // Basic Email Validation
  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form Submitted', formData);
      
      this.service.login(formData).subscribe(data=>{
        localStorage.setItem("token",data.token)
        this.route.navigate(["admin/WorkoutPrograms-list"])
      },
      err=>{
        this.toastr.error(err.error);
      });
      
    } else {
      console.log('Form is invalid');
    }
  }

}
