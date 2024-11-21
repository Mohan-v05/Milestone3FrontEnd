import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberListComponent } from './Member/member-list/member-list.component';
import { MemberAddComponent } from './Member/member-add/member-add.component';

import { ProgramsListComponent } from './GymPrograms/programs-list/programs-list.component';
import { Router } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlankLayoutComponent } from './Layout/blank-layout/blank-layout.component';
import { AdminLayoutComponent } from './Layout/admin-layout/admin-layout.component';
import { RegisterComponent } from './Register/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr'
import { AuthInterceptor } from './auth.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { UserSearchPipe } from './pipe/user-search.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MemberLayoutComponent } from './Layout/member-layout/member-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    MemberListComponent,
    MemberAddComponent,
    ProgramsListComponent,
    LoginComponent,
    BlankLayoutComponent,
    AdminLayoutComponent,
    RegisterComponent,
    DashboardComponent,
    UserSearchPipe,
    MemberLayoutComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule, 
    NgFor,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxChartsModule
  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
