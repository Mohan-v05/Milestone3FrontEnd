import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './Member/member-list/member-list.component';
import { ProgramsListComponent } from './GymPrograms/programs-list/programs-list.component';
import { LoginComponent } from './login/login.component';
import { BlankLayoutComponent } from './Layout/blank-layout/blank-layout.component';
import { AdminLayoutComponent } from './Layout/admin-layout/admin-layout.component';
import { RegisterComponent } from './Register/register/register.component';


const routes: Routes = [
  { path:'',
    component:BlankLayoutComponent,
    children:[{
      path:'',
      component:LoginComponent
    },
    {
      path:'register',
      component:RegisterComponent
    }
  ]
  },
  {
    path:'admin',
    component:AdminLayoutComponent,
    children:[{
        path:'Member-list',
        component:MemberListComponent
      },
      {
        path:'WorkoutPrograms-list',
        component:ProgramsListComponent
      }
    ]
  }
 

  
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
