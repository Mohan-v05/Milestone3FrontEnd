import { Component, OnInit } from '@angular/core';
import {  GymManagementSystemService, UserResponse, notification } from '../../gym-management-system.service';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface changePassword {
  nic: string;
  id: any;
  oldPassword: string;
  newPassword: string;
}

interface DecodedToken {
  Email: string;
  Id: number;
  Name: string;
  Role: string;
  aud: string;
}

@Component({
  selector: 'app-member-layout',
  templateUrl: './member-layout.component.html',
  styleUrls: ['./member-layout.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class MemberLayoutComponent implements OnInit {
  // Token & Decoded Token
  token = localStorage.getItem('token') || '';
  decodedToken: DecodedToken = jwtDecode(this.token);
  id = this.decodedToken.Id;

  // User and Notifications
  LoggedInUser: UserResponse | null = null;
  notification: notification[] = [];

  get hasNewNotifications() {
    return this.LoggedInUser?.notification.some((n: notification) => !n.isRead&&n.status);
  }

  // UI Flags
  isSidebarOpen: boolean = true;
  showNotifications: boolean = false;
  ViewPaymentsHistory: boolean = false;

  // Profile & Password Change
  changePasswordData: changePassword = {
    nic: '',
    id: 0,
    oldPassword: '',
    newPassword: '',
  };
  successMessage: string = '';
  totalDuration: number = 30; // Default subscription duration
  Daysmore: number = 0;
  currentDate = new Date();

  constructor(
    public service: GymManagementSystemService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.decodedToken);
    this.getUserDetails();
    console.log(this.id);
  }

  // ** User Details & Profile **
  getUserDetails() {
    this.service.getUserProfile(this.id).subscribe(
      (data) => {
        this.LoggedInUser = data;
        this.calculateDaysMore();
        this.updateUserData();
        this.pushnotification(data.notification);
        console.log(data);
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  updateUserData() {
    if (this.LoggedInUser) {
      this.successMessage = `${this.LoggedInUser.name}, you are successfully logged in!`;
    }
  }

  updateMyprofile(form: NgForm) {
    if (form.valid && this.LoggedInUser) {
      const updateData = {
        name: this.LoggedInUser.name,
        email: this.LoggedInUser.email,
        address: {
          firstLine: this.LoggedInUser.address.firstLine,
          secondLine: this.LoggedInUser.address.secondLine,
          city: this.LoggedInUser.address.city,
        },
        nicnumber: this.LoggedInUser.nicnumber,
      };

      this.service.updateMember(this.LoggedInUser.id, updateData).subscribe(
        (response) => {
          console.log('Profile updated successfully:', response);
          this.toastr.success('Your profile has been updated successfully!');
          form.resetForm();
          this.getUserDetails()
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.toastr.error('Failed to update the profile. Please try again.');
        }
      );
    } else {
      this.toastr.success('Please fill out the form correctly.');
    }
  }

  // ** Notifications **
  pushnotification(data: notification[]) {
    this.notification = data.filter(n=>n.status == true);
  }

  deleteNotification(string: string) {
    
    this.service.deleteNotification(string).subscribe(
      (data) => {
        this.toastr.success('Notification deleted successfully');
        this.notification = this.notification.filter((n) => n.id != string);
        console.log(data);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  markasRead(string: string) {
    this.service.MarkasRead(string).subscribe(
      (data) => {
        console.log(data);
       this.getUserDetails()
      },
      (error) => {
        console.log(error);
        
      }
    );
  }

  // ** Password Change **
  changePassword(form: NgForm) {
    if (form.valid) {
      if (!this.LoggedInUser) {
        alert('No user is logged in. Please log in again.');
        return;
      }
      if (this.changePasswordData.oldPassword == this.changePasswordData.newPassword) {
        alert('New password should not be the same as the old password');
        return;
      }
      if (this.changePasswordData.newPassword.length < 6) {
        alert('Password should be at least 6 characters');
        return;
      }
      if (this.changePasswordData.nic != this.LoggedInUser.nicnumber) {
        alert('NIC does not match');
        return;
      }

      this.service.changePassword(this.changePasswordData).subscribe(
        (response) => {
          alert('Password changed successfully!');
          form.reset();
        },
        (error) => {
          console.error('Error changing password:', error);
          alert('Failed to change password. Please try again.');
        }
      );
    }
  }

  // ** Subscription & Progress **
  calculateDaysMore() {
    if (this.LoggedInUser?.expiryDate) {
      const expiry = new Date(this.LoggedInUser.expiryDate);
      const timeDiff = expiry.getTime() - this.currentDate.getTime();
      this.Daysmore = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      this.Daysmore = 0;
    }
  }

  calculateProgress() {
    return Math.min((this.Daysmore / this.totalDuration) * 100, 100);
  }

  // ** Account Management **
  deleteAccount() {
    if (
      this.LoggedInUser &&
      confirm('Are you sure you want to delete your account? This action is irreversible.')
    ) {
      this.service.Deleteuser(this.LoggedInUser.id, true).subscribe(
        (response) => {
          console.log('Account deletion response:', response);
          alert('Your account has been successfully deleted. Redirecting to the login page...');
          this.Logout();
        },
        (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete the account. Please try again later.');
        }
      );
    } else {
      alert('No user is logged in, or action was canceled.');
    }
  }

  // ** Utility Functions **
  closeModal() {
    this.showNotifications = false;
  }

  Logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
