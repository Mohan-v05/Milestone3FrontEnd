import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { GymManagementSystemService, Role, User } from '../../gym-management-system.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { MemberAddComponent } from '../member-add/member-add.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //bsModalRef?: BsModalRef;
  title = 'USER LIST';
  searchTerm: string = '';  // Binding this to the search input
  users: User[] = [];
  modalRef?: BsModalRef;
  message?: string;

  constructor(private modalService: BsModalService,
    private service: GymManagementSystemService,
    private router: Router,
    private toastr: ToastrService
   
  ) {}
  filter : any;
  ngOnInit(): void {
    this.Loaduser();
  }

  Loaduser(): void {
    this.service.getUsers().subscribe((data) => {
      this.users = data;
      console.log(this.users);
    });
  }
  getRoleName(role: Role): string {
    return Role[role];
  }
  DeactiveUnpaid(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  
  confirm(){
   this.service.DeactivateAllActiveMembers().subscribe((data) => {
    console.log(data);
    
    this.toastr.success('Deactivated all expired users');
  }
    ,
    (error) => {
      this.toastr.error('error', error.error);
    });
    this.modalRef?.hide();
}
decline(){
  this.toastr.info('Declined');
  this.modalRef?.hide();
  
}
GetActiveMember() {
  this.users = this.users.filter(u => u.isActivated == true);
}

SoftDeleteUser(userId: number): void {
  if (confirm('Are you sure you want to Deactivate this account? ')){
    let permanent = false;
    console.log(userId);
   this.service.Deleteuser(userId, permanent).subscribe(
    (data) => {
      console.log('User soft deleted:', data);
      this.toastr.success('User has been deactivated successfully.');
    },
    (error) => {
      console.error('Error soft deleting user:', error);
      this.toastr.error('Failed to deactivate the user. Please try again later.');
    }
  );
  }
  
}

HardDeleteUser(userId: number,i:number): void {
  if (confirm('Are you sure you want to permanently delete this account? This action is irreversible.')) {
    this.service.Deleteuser(userId, true).subscribe(
      (response) => {
        console.log('User hard deleted:', response);
        this.toastr.success('The account has been deleted successfully.');
        this.users.splice(i, 1);
      },
      (error) => {
        console.error('Error hard deleting user:', error);
        this.toastr.error('Failed to delete the account. Please try again later.');
      }
    );
  }
}

  GotoEditPage(id: number): void {
    this.router.navigate(['edit/', id]);
  }
}
