import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtPayload } from 'jwt-decode';
import { Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class GymManagementSystemService {
  url="http://localhost:5159/api"
  Programurl= "http://localhost:5159/api/GymPrograms"
  userUrl="http://localhost:5159/api/User"
  paymentUrl='http://localhost:5159/api/Payment'
  EnrollmentsUrl='http://localhost:5159/api/Enrollement'

  constructor(private http:HttpClient) { }

 login(logincredential:logincredential){
  console.log("apiConnected")
  let data = this.http.post<LoginResponse>(this.url+"/User/login",logincredential)
  console.log(data)
  return data

 }
 
//Programs api
  getPrograms(){
    console.log("apiConnected")
    return this.http.get<GymProgram[]>(this.Programurl);
  }
 
  createProgramWithImage(formData: FormData): Observable<any> {
    return this.http.post(this.Programurl+"/createwithimage", formData);
  }
  
  DeleteProgram(id:number){
  return this.http.delete(this.Programurl+"/"+id)
  }


  //user api
  getUserProfile(id:number): Observable<UserResponse> {
    return this.http.get<UserResponse>('http://localhost:5159/api/User/GetUserbyId/'+id);

  }
  DeactivateAllActiveMembers(){
    return this.http.get<User[]>(this.userUrl)
  }

  getUsers(){
    console.log("api connected")
    return this.http.get<User[]>(this.userUrl+"/Getall")
  }
  
  Deleteuser(id: number, permanent: boolean) {
    return this.http.delete(
      `http://localhost:5159/api/User/${id}/${permanent}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  
  
  getMemberById(id: number) {
    return this.http.get<User>(`http://localhost:5159/api/User/GetUserbyId/${id}`);
  }
  
  updateMember(id: number, data: any) {
    return this.http.put(`http://localhost:5159/api/User/${id}`, data);
  }
  
  addMember(data: any) {
    return this.http.post<User>('http://localhost:5159/api/User/addNewUser', data);
  }

  changePassword(data: { nic: string; id: string; oldPassword: string; newPassword: string }): Observable<any> {
    return this.http.patch("http://localhost:5159/api/User/change-password", data);
  }

  //Get all payments
  AddPayment(data:Payments){
    return this.http.post<PaymentResponse>(this.paymentUrl,data)
  }

  GetAllPayments(){
   var data=this.http.get<Payments[]>(this.paymentUrl)
    return data
  }
 

  ///Enrollment
  AddEnrollments(Enrollmentreq:enrollmentreq){
    var data= this.http.post(this.EnrollmentsUrl,Enrollmentreq)
    return data
  }
  deleteEnrollment(id: string) {
    return this.http.delete("http://localhost:5159/api/Enrollement/"+id);
  }

  //notificatrion
 MarkasRead(id:string){
    return this.http.patch('http://localhost:5159/api/Notification',id)
 }
 
  deleteNotification(id:string){
    return this.http.delete(`http://localhost:5159/api/Notification/${id}`)
  }
}

export interface  PaymentResponse{
  id:string,
  quantity: number, 
  payeeName: string,
  payerName: string,
  paymentDate: Date,
  description:string
}

//Export Enrollment Model
export interface enrollmentreq{ 
    userId: number,
    programIds:number[]
}

// Export Interfaces


//export user Interface
export interface User {
  id: number; 
  name: string; 
  email: string; 
  role: Role; 
  nicnumber: string; 
  address: address; 
  gender: string; 
  passwordHashed: string; 
  enrollment: Enrollment[

  ];
  payments: Payments[];
  fees: number;
  isActivated: boolean; 
  expiryDate: string; 
}
export enum PaymentType {
  InitialPayment = 1,
  Monthly = 3,
  Annual = 2
}


/////////////////////////////////////////////
export interface Address {
  id: number;
  firstLine: string;
  secondLine: string;
  city: string;
  user: null | any; 
  userId: number;
}

export interface GymProgram {
  id: number;
  name: string;
  description: string;
  category: string;
  fees: number;
  imagePath: string;
  enrollments: Enrollment[]; 
}

export interface Enrollment {
  id: string;
  user: null | any; // Adjust if `user` is expected to have a type.
  userId: number;
  gymProgram: GymProgram;
  gymProgramId: number;
  enrolledDate: string; // ISO date string
}

export interface Payment {
  id: string;
  payer: null | any; // Adjust if `payer` is expected to have a type.
  payerId: number;
  payee: null | any; // Adjust if `payee` is expected to have a type.
  payeeId: number;
  dateTime: string; // ISO date string
  quantity: number;
  amount: number;
  paymentType: number;
  description: string;
}

 
// src/app/models/notification.model.ts
export interface notification {
  id: string;
  title: string;
  message: string;
  user: any; // Adjust the type as needed
  userId: number;
  status: boolean;
  isRead: boolean;
}
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: number;
  nicnumber: string;
  address: Address;
  gender: string;
  passwordHashed: string;
  enrollment: Enrollment[];
  payments: Payment[];
  notification: notification[];
  fees: number;
  isActivated: boolean;
  expiryDate: string; 
}

export interface address{
  id:number
  city: string;
  firstLine:string;
  secondLine:string;
}


  export interface Payments {
    id: string;           
    userId: number;       
    user: any | null;     
    dateTime: string;     
    amount: number;       
    paymentType: number; 
    description: string | null; 
    receiverId: number;   
  }



// Login Interface
export interface logincredential{
  email:string,
  password:string
}

//Login Response
export interface LoginResponse {
  token: string;
}
 export enum Role
{
    Admin=1,
    Member=2
}

export enum PaymentType
{
    Initialpayment = 1,
    AnnualSubcribtionrenewal = 2,
    MonthlySubscribtionrenewal = 3,
    Other= 4,
}   

export enum Membershiptype
{
    annual=1,
    monthly=2 
}

// Interface for the decoded token structure
interface DecodedToken extends JwtPayload {
  Name?: string; 
  Role:string;
  id: number;
  email: string;
  role: Role;
}
