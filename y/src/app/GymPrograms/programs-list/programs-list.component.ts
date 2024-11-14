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
  Programs: gprograms[]=[{
    name: "Pullups",
    id: 0,
    description: 'Pull ups good for your shoulders',
    category: 'Calisthenics',
    fees: 1000,
    imageurl: "image (3).png"
  },
  { 
    name: "Pushups",
    id: 1,
    description: 'Great for upper body strength',
    category: 'Calisthenics',
    fees: 800,
    imageurl: "Milestone3Backend/GYM_MILESTONETHREE/GYM_MILESTONETHREE/wwwroot/images/yoga.jpg"
  },
  {
    name: "Squats",
    id: 2,
    description: 'Effective for legs and core',
    category: 'Calisthenics',
    fees: 1200,
    imageurl: "https://th.bing.com/th/id/OIP.GdOpyGYEQGd971a4R8-9JwHaEp?w=259&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7"
  },
  {
    name: "Lunges",
    id: 3,
    description: 'Good for leg strength and balance',
    category: 'Calisthenics',
    fees: 1100,
    imageurl: "https://th.bing.com/th/id/OIP._0CLOqukFgG2JBRoyUsWewHaFj?w=198&h=207&c=7&r=0&o=5&dpr=1.3&pid=1.7"
  },
  {
    name: "Planks",
    id: 4,
    description: 'Great for core stability',
    category: 'Calisthenics',
    fees: 900,
    imageurl: "https://th.bing.com/th/id/OIP.0sMhO-OSqMv6l62kbBImRgHaE8?w=219&h=231&c=7&r=0&o=5&dpr=1.3&pid=1.7"
  }];
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
     // this.Programs=data
      console.log(data);

    })
  }
 
}
