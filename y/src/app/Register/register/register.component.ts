
  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  
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

    constructor(private fb: FormBuilder) {
      // Initialize the form
      this.registerForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, { 
        // Custom validator to ensure password and confirmPassword match
        validators: this.passwordsMatch('password', 'confirmPassword') 
      });
    }
  
    ngOnInit(): void {}
  
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
      if (this.registerForm.valid) {
        const formData = this.registerForm.value;
        console.log('Registration Successful', formData);
        // Here, you could integrate the registration logic (API call)
      } else {
        console.log('Form is invalid');
      }
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

