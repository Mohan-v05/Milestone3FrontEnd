import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberListComponent } from './Member/member-list/member-list.component';
import { MemberAddComponent } from './Member/member-add/member-add.component';

import { ProgramsListComponent } from './GymPrograms/programs-list/programs-list.component';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgFor } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlankLayoutComponent } from './Layout/blank-layout/blank-layout.component';
import { AdminLayoutComponent } from './Layout/admin-layout/admin-layout.component';
import { RegisterComponent } from './Register/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    MemberListComponent,
    MemberAddComponent,
    ProgramsListComponent,
    LoginComponent,
    BlankLayoutComponent,
    AdminLayoutComponent,
    RegisterComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule, 
    NgFor,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
