import { Component, OnInit } from '@angular/core';
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

  constructor(
    private service: GymManagementSystemService,
    private router: Router,
   // private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.Loaduser();
  }

  openModalWithComponent() {
    const initialState: ModalOptions = {};
    //this.bsModalRef = this.modalService.show(MemberAddComponent, initialState);

    // Ensure content is defined before accessing closeBtnName
   // if (this.bsModalRef?.content) {
     // this.bsModalRef.content.closeBtnName = 'Close';
    //}
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
