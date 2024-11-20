import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.css']
})
export class MemberAddComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],  // Full name
      email: ['', [Validators.required, Validators.email]],  // Email field
      gender: ['', Validators.required],  // Gender field
      role: [1, Validators.required],  // Default to 'User'
      nicnumber: ['', Validators.required],  // NIC number
      address: this.fb.group({
        firstLine: ['', Validators.required],
        secondLine: ['', Validators.required],
        city: ['', Validators.required]
      }),  // Address with subfields
      password: ['', [Validators.required, Validators.minLength(6)]]  // Password with validation
    });
  }

  // Method to check if a form field is invalid
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? (control.invalid && (control.touched || control.dirty)) : false;
  }
  

  // Form submission
  onSubmit(): void {
    if (this.registerForm.valid) {
      // Log the form data to the console
      console.log('Form Submitted:', this.registerForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
