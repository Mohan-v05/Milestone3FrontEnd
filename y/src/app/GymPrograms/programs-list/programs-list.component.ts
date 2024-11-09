import { Component, OnInit } from '@angular/core';
import { GymManagementSystemService, gprograms } from '../../gym-management-system.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrl: './programs-list.component.css'
})
export class ProgramsListComponent implements OnInit {
//Array to List
  Programs: gprograms[]=[];
  NewProgramForm:FormGroup;

  constructor(private programservice:GymManagementSystemService, private Fb:FormBuilder){
    this.NewProgramForm=this.Fb.group({
       Name:['',Validators.required],
       Description:[''],
       Category:[],
       Fees :['',Validators.required]
    })
  }
  
  AddNewProgram(){
    console.log(this.NewProgramForm.value)
  }

  ngOnInit(): void {
    this.GetAllPrograms();
    console.log(this.Programs)
  }
   

  GetAllPrograms(){
    
    this.programservice.getPrograms().subscribe(data=>{
      this.Programs=data
      console.log(data);

    })
  }
 
}
