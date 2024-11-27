import { Component, OnInit } from '@angular/core';
import { gprograms, GymManagementSystemService, UserResponse, notification } from '../../gym-management-system.service';
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
interface DecodedToken{
  Email
: string
Id
: 
number
Name
: 
string
Role
: 
string
aud
: 
string
}
@Component({
  selector: 'app-member-layout',
  templateUrl: './member-layout.component.html',
  styleUrls: ['./member-layout.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class MemberLayoutComponent implements OnInit {

token=localStorage.getItem('token')||'';
decodedToken:DecodedToken = jwtDecode(this.token);
id=this.decodedToken.Id;



changePasswordData:changePassword = {
  nic: '',
  id: 0,
  oldPassword: '',
  newPassword: '',
};
  successMessage: string = '';

  LoggedInUser: UserResponse | null = null;

  isSidebarOpen: boolean = true;

  Daysmore: number = 0;

  ViewPaymentsHistory:boolean=false

  totalDuration: number = 30; 

  showNotifications: boolean = false;

   currentDate = new Date();
 
  notification: notification[] = [];
  
  get hasNewNotifications() {
    return this.LoggedInUser?.notification.some((n: notification) => !n.isRead);}
  
  constructor(public service: GymManagementSystemService, private router: Router,private toastr:ToastrService) {}


  closeModal() {
    this.showNotifications = false;
  }
  ngOnInit(): void {
    console.log(this.token);
    console.log(this.decodedToken);
    this.getUserDetails();
    console.log(this.id);
  }

  getUserDetails() {
    console.log(this.id);
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
  updateMyprofile(form: NgForm) {
    if (form.valid && this.LoggedInUser) {
      console.log('Updating profile for user:', this.LoggedInUser);
  
      // Prepare updated user data
      const updatedData = {
        id: this.LoggedInUser.id,
        name: this.LoggedInUser.name,
        email: this.LoggedInUser.email,
        address: {
          firstLine: this.LoggedInUser.address.firstLine,
          secondLine: this.LoggedInUser.address.secondLine, // Include the second line of the address
          city: this.LoggedInUser.address.city,
        },
        nicnumber: this.LoggedInUser.nicnumber,
      };
  
      // Call the backend service to update the profile
      this.service.updateMember(updatedData.id, updatedData).subscribe(
        (response) => {
          console.log('Profile updated successfully:', response);
          alert('Your profile has been updated successfully!');
          form.resetForm(this.LoggedInUser); // Reset the form to updated values
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
  

  pushnotification(data: notification[]) {
    this.notification = data.filter(n=>n.status==true);
  }

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

  updateUserData() {
    if (this.LoggedInUser) {
      this.successMessage = `${this.LoggedInUser.name}, you are successfully logged in!`;
    }
  }

  changePassword(form: NgForm) {
    if (form.valid) {
      console.log('Change Password Data:', this.changePasswordData);

      if (!this.LoggedInUser) {
        alert('No user is logged in. Please log in again.');
        return;
      }if(this.changePasswordData.oldPassword==this.changePasswordData.newPassword){
        alert('New password should not be same as old password');
        return;
      }if(this.changePasswordData.newPassword.length<6){
        alert('Password should be atleast 6 characters');
        return;
      }if(this.changePasswordData.nic!=this.LoggedInUser.nicnumber){
        alert('NIC does not match');
        return;
      }
      console.log('Change Password Data:', this.changePasswordData);
       
      // Call the backend service to update the password
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
  
  deleteAccount() {
    if (this.LoggedInUser && confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      this.service.Deleteuser(this.LoggedInUser.id,true).subscribe(
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
  

  deleteNotification(string: string) {
    this.notification = this.notification.filter(n=>n.id!=string);
    this.service.deleteNotification(string).subscribe(data=>{
    this.toastr.success('Notification deleted successfully');
    console.log(data)},
    error=>{console.log(error)})
    }

    markasRead(string: string) {
   this.service.MarkasRead(string).subscribe(data=>{
    console.log(data)},
    error=>{console.log(error)})
    }

  

  Logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
