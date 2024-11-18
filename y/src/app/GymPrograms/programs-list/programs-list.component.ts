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
  selectedImage: File | null = null;
  constructor(private programservice:GymManagementSystemService, private Fb:FormBuilder){
    this.NewProgramForm=this.Fb.group({
       Name:['',Validators.required],
       Description:[''],
       Category:[],
       Fees :['',Validators.required]
    })
  }
  // Handle image file input
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }
  
  AddNewProgram(){
    console.log(this.NewProgramForm.value)
  }

  ngOnInit(): void {
    this.GetAllPrograms();
    //console.log(this.Programs)
  }
   

  GetAllPrograms(){
    
    this.programservice.getPrograms().subscribe(data=>{
      this.Programs=data
      console.log(data);

    })
  }
  onSubmit(): void {
    if (this.NewProgramForm.valid && this.selectedImage) {
      const formData = new FormData();
      formData.append('Name', this.NewProgramForm.value.Name);
      formData.append('Description', this.NewProgramForm.value.Description);
      formData.append('Category', this.NewProgramForm.value.Category);
      formData.append('Fees', this.NewProgramForm.value.Fees);
      formData.append('image', this.selectedImage, this.selectedImage.name);

     
      this.programservice.createProgramWithImage(formData).subscribe(
        (response) => {
          console.log('Program created successfully!', response);
        },
        (error) => {
          console.error('Error creating program:', error);
        }
      );
    } else {
      console.log('Form is invalid or no image selected');
    }
  }

  Remove():void
  {
         
  }
 
}
