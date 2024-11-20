import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class GymManagementSystemService {
  url="http://localhost:5159/api"
  Programurl= "http://localhost:5159/api/GymPrograms"
  userUrl="http://localhost:5159/api/User"
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
    return this.http.delete(this.userUrl+id);
  }
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
  role: number; 
  nicnumber: string; 
  address: address; 
  gender: string; 
  passwordHashed: string; 
  enrollment: string | null;
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


// Login Interface
export interface logincredential{
  email:string,
  password:string
}

//Login Response
export interface LoginResponse {
  token: string;
}