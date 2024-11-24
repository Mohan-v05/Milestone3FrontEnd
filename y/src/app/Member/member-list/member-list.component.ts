import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { GymManagementSystemService, Role, User } from '../../gym-management-system.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { MemberAddComponent } from '../member-add/member-add.component';

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

    this.modalRef?.hide();
}
decline(){
  this.modalRef?.hide();
  
}
GetActiveMember() {
  this.users = this.users.filter(u => u.isActivated == true);
}
  Deleteuser(userId: number , i : number): void {
    console.log(userId)
    this.service.Deleteuser(userId).subscribe((data) => {
      console.log(data);
      this.users.splice(i , 1);
     // this.Loaduser();  // Reload users after deletion
    });
  }

  GotoEditPage(id: number): void {
    this.router.navigate(['edit/', id]);
  }
}
