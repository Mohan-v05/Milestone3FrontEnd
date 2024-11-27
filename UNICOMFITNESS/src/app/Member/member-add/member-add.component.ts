import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';  // Import necessary services

import { GymManagementSystemService, Role } from '../../gym-management-system.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.css']
})
export class MemberAddComponent implements OnInit {
  registerForm: FormGroup;
  title: string = 'User Registration';
  memberId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,  // To get route parameters
    private memberService: GymManagementSystemService,  // Service to interact with API
    private router: Router,
    private taostr:ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      role: [1, Validators.required],
      nicnumber: ['', Validators.required],
      address: this.fb.group({
        firstLine: ['', Validators.required],
        secondLine: ['', Validators.required],
        city: ['', Validators.required]
      }),
      password: ['', [Validators.required, Validators.minLength(6)]],
      conpassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Check if we are editing or adding
    this.route.paramMap.subscribe(params => {
      this.memberId = parseInt(params.get('id')||'');  // Get 'id' from the URL

      if (this.memberId) {
        this.title = 'Edit Member';  // Change title for editing
        this.loadMemberData();  // If editing, load data
      }
    });
  }

  // Fetch member data for editing
  loadMemberData(): void {
    this.memberService.getMemberById(this.memberId!).subscribe(
      (member) => {
        //console.log(member)
        this.registerForm.patchValue({
          name: member.name,
          email: member.email,
          gender: member.gender,
          role:member.role, 
          nicnumber: member.nicnumber,
          address: {
            firstLine: member.address.firstLine,
            secondLine: member.address.secondLine,
            city: member.address.city
          },
         
        });
      },
      (error) => {
        console.log('Error loading member data:', error);
      }
    );
  }

  // Method to check if a form field is invalid
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? (control.invalid && (control.touched || control.dirty)) : false;
  }

  // Form submission (Add or Edit)
  onSubmit(): void {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password === this.registerForm.value.conpassword) {
        const formData = {
          name: this.registerForm.value.name,
          email: this.registerForm.value.email,
          gender: this.registerForm.value.gender,
          role: parseInt((this.registerForm.value.role)),
          nicnumber: this.registerForm.value.nicnumber,
          address: {
            firstLine: this.registerForm.value.address.firstLine,
            secondLine: this.registerForm.value.address.secondLine,
            city: this.registerForm.value.address.city
          },
          password: this.registerForm.value.password,
          isActivated: false  
        };

        if (this.memberId) {
          // Edit existing member if ID is present
          this.memberService.updateMember(this.memberId, formData).subscribe(
            (response) => {
              console.log('Member updated:', response);
              this.router.navigate(['/members']);  // Navigate to members list or dashboard
            },
            (error) => {
              console.log('Error updating member:', error);
            }
          );
        } else {
         
          this.memberService.addMember(formData).subscribe(
            (response) => {
              console.log('Member added:', response);
              this.taostr.success(response.name+"Added succesful")
             // this.router.navigate(['/member']);  // Navigate to members list or dashboard
             this.registerForm.reset();
            },
            (error) => {
              console.error('Error response:', error.error);
              if (error.status === 400) {
                
                this.taostr.error('Error adding member: ' + error.error); // Display error message from backend
              } else {
                this.taostr.error('An unexpected error occurred');
              }
              console.error('Error adding user:', error);
            }
          );
        }
      } else {
        this.taostr.error('Password and Confirm Password do not match');
      }
    } else {
      console.log('Form is invalid');
    }
  }
}

