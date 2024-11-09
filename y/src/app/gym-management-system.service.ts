import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GymManagementSystemService {
  url="http://localhost:5159/api/GymPrograms"

  constructor(private http:HttpClient) { }

  getPrograms(){
    console.log("apiConnected")
    return this.http.get<gprograms[]>('http://localhost:5159/api/GymPrograms');
  }

}

// Export Interfaces
export interface gprograms{
  id:number,
  name:string,
  description:string,
  category:string,
  fees:number
}