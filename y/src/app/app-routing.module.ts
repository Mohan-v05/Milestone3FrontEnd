import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './Member/member-list/member-list.component';
import { ProgramsListComponent } from './GymPrograms/programs-list/programs-list.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path:'Member-list',
    component:MemberListComponent
  },
  {
    path:'WorkoutPrograms-list',
    component:ProgramsListComponent
  },

  {
    path:'login',
    component:LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
