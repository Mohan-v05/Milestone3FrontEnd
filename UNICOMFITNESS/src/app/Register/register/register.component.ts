
  import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GymManagementSystemService, User } from '../../gym-management-system.service';
import { ToastrService } from 'ngx-toastr';
  
  @Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
  })
  export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
     
    // Variables for password strength
  passwordStrength: number = 0;
  passwordStrengthClass: string = '';
  passwordStrengthMessage: string = '';

    constructor(private fb: FormBuilder,private service :GymManagementSystemService,private toastr:ToastrService) 
    {
      this.registerForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        gender: [''],
        role: [2],
        nicnumber: ['', [Validators.required,this.nicValidator(), Validators.minLength(10)]],
        address: this.fb.group({
          firstLine: ['', Validators.required],
          secondLine: ['', Validators.required],
          city: ['', Validators.required]
        }),
        isActivated: [false]
      }, { 
        
        validators: this.passwordsMatch('password', 'confirmPassword') 
      });
    }
    
  
    ngOnInit(): void {}
  
    // Custom validator for NIC number validation
  nicValidator() {
    return (control: any) => {
      const nicPattern = /^[0-9]{12}(V|v)?$/; 
      if (control.value && !nicPattern.test(control.value)) {
        return { invalidNic: true };
      }
      return null;
    };
  }

  // Custom validator to check if password and confirmPassword match
  passwordsMatch(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }
    // Handle form submission
    onSubmit(): void {
      // if (this.registerForm.valid) {
      //   // const formData = {
      //   //   name: this.registerForm.value.name,
      //   //   email: this.registerForm.value.email,
      //   //   gender: this.registerForm.value.gender,
      //   //   role: this.registerForm.value.role,
      //   //   nicnumber: this.registerForm.value.nicnumber,
      //   //   password: this.registerForm.value.password,
      //   //   isActivated: false  
      //   };
        this.service.addMember(this.registerForm.value).subscribe(
          (response) => {
            console.log('Member added:', response);
            this.toastr.success(response.name+ "Your Registration Succesful")
          
           this.registerForm.reset();
          },
          (error) => {
            console.error('Error response:', error.error);
          });
    
      // } else {
      //   console.log('Form is invalid');
      // }
    }
   
  // Function to check password strength
  checkPasswordStrength(): void {
    const password = this.registerForm.get('password')?.value;
    let strength = 0;

    // Check password strength based on the length and character types
    if (password.length >= 6) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    // Set password strength based on the score
    this.passwordStrength = strength * 20;
    
    if (this.passwordStrength === 100) {
      this.passwordStrengthClass = 'bg-success';
      this.passwordStrengthMessage = 'Very Strong';
    } else if (this.passwordStrength >= 80) {
      this.passwordStrengthClass = 'bg-success';
      this.passwordStrengthMessage = 'Strong';
    } else if (this.passwordStrength >= 60) {
      this.passwordStrengthClass = 'bg-warning';
      this.passwordStrengthMessage = 'Medium';
    } else if (this.passwordStrength >= 40) {
      this.passwordStrengthClass = 'bg-danger';
      this.passwordStrengthMessage = 'Weak';
    } else {
      this.passwordStrengthClass = 'bg-danger';
      this.passwordStrengthMessage = 'Very Weak';
    }
  }
}

