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
  return this.http.post<LoginResponse>(this.url+"/User/login",logincredential)
 }
 
//Programs api
  getPrograms(){
    console.log("apiConnected")
    return this.http.get<gprograms[]>(this.Programurl);
  }
 
  createProgramWithImage(formData: FormData): Observable<any> {
    return this.http.post(this.Programurl+"/createwithimage", formData);
  }
  
  DeleteProgram(id:number){
  return this.http.delete(this.Programurl+"/"+id)
  }


  //user api
  getUsers(){
    console.log("api connected")
    return this.http.get<User[]>(this.userUrl+"/Getall")
  }
  Deleteuser(id:number){
    return this.http.delete("http://localhost:5159/api/User/"+id);
  }
  getMemberById(id: number) {
    return this.http.get<User>(`http://localhost:5159/api/User/GetUserbyId/${id}`);
  }
  
  updateMember(id: number, data: any) {
    return this.http.put(`/api/User/${id}`, data);
  }
  
  addMember(data: any) {
    return this.http.post<User>('http://localhost:5159/api/User/addNewUser', data);
  }

  //Get all payments
  GetAllPayments(){
   var data=this.http.get<Payments[]>(this.paymentUrl)
    return data
  }
 
  AddEnrollments(Enrollmentreq:enrollmentreq){
    var data= this.http.post(this.EnrollmentsUrl,Enrollmentreq)
    return data
  }


}

//Export Enrollment Model
export interface enrollmentreq{ 
    userId: number,
    programIds:number[]
}

// Export Interfaces
export interface gprograms{
  id:number, 
  name:string,
  description:string,
  category:string,
  fees:number,
  imagePath:string,
  enrollments:object,
  noofEnrollment:number
}

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
  enrollment: any[];
  fees: number;
  isActivated: boolean; 
  expiryDate: string; 
}
export enum PaymentType {
  InitialPayment = 1,
  Monthly = 2,
  Annual = 3
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
}
