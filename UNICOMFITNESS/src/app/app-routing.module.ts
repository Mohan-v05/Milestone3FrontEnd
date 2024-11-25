import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './Member/member-list/member-list.component';
import { ProgramsListComponent } from './GymPrograms/programs-list/programs-list.component';
import { LoginComponent } from './login/login.component';
import { BlankLayoutComponent } from './Layout/blank-layout/blank-layout.component';
import { AdminLayoutComponent } from './Layout/admin-layout/admin-layout.component';
import { RegisterComponent } from './Register/register/register.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { MemberAddComponent } from './Member/member-add/member-add.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { PaymentReportsComponent } from './payment-reports/payment-reports.component';
import { MemberLayoutComponent } from './Layout/member-layout/member-layout.component';
import { MemberAuthGuard } from './memberauth.guard';


const routes: Routes = [
  { path:'',
    component:BlankLayoutComponent,
    children:[{
      path:'login',
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
    canActivate:[authGuard],
    children:[{
        path:'Member-list',
        component:MemberListComponent
      },
      {
        path:"Member-add",
        component:MemberAddComponent     
       },
       { path: 'member/:id', component: MemberAddComponent }, 
       { path: 'Member-add', component: MemberAddComponent } , 

      { path:'WorkoutPrograms-list',   component:ProgramsListComponent},
      { path:'Dashboard', component:DashboardComponent},

      { path:'Add-Payment', component:AddPaymentComponent},
      {path:'list-Payments',component:PaymentReportsComponent}
    ]
  },
  {
    path:'member',
    component:MemberLayoutComponent,
    canActivate:[MemberAuthGuard],
  }
 
  
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
