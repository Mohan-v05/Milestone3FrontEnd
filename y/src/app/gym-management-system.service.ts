import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GymManagementSystemService {
  url="http://localhost:5159/api"

  constructor(private http:HttpClient) { }

 login(logincredential:logincredential){
  console.log("apiConnected")
  return this.http.post<LoginResponse>(this.url+"/User/login",logincredential)
 }
 

  getPrograms(){
    console.log("apiConnected")
    return this.http.get<gprograms[]>(this.url+"/GymPrograms");
  }

}

// Export Interfaces
export interface gprograms{
  id:number,
  name:string,
  description:string,
  category:string,
  fees:number
  imageurl:string
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