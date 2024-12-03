import { Component, OnInit } from '@angular/core';
import { GymManagementSystemService, GymProgram, } from '../../gym-management-system.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrl: './programs-list.component.css'
})
export class ProgramsListComponent implements OnInit {
//Array to List
  Programs: GymProgram[]=[];


  NewProgramForm:FormGroup;

  selectedImage: File | null = null;

  isEdit:boolean=false;

  editingId!:number

  constructor(private programservice:GymManagementSystemService, private Fb:FormBuilder,private Toastr:ToastrService){
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
   
  }
   
  GetAllPrograms(){
    
    this.programservice.getPrograms().subscribe(data=>{
      this.Programs=data;
      console.log(this.Programs)
    })
  }
  onSubmit(): void {
    if (this.NewProgramForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.NewProgramForm.value.Name);
      formData.append('Description', this.NewProgramForm.value.Description);
      formData.append('Category', this.NewProgramForm.value.Category);
      formData.append('Fees', this.NewProgramForm.value.Fees);
      
      if(this.selectedImage){
        formData.append('image', this.selectedImage, this.selectedImage.name);
      }
     
      if (!this.isEdit) {
        this.programservice.createProgramWithImage(formData).subscribe(
          (response) => {
            this.Toastr.success('Program added successfully');
            console.log('Program created successfully!', response);
            this.selectedImage = null;
            this.NewProgramForm.reset();        
            this.Programs.push(response)
            
          },
          (error) => {
            this.Toastr.error(error.error.message)
            console.error('Error creating program:', error);
          }
        );
      }else 
      if(this.isEdit){
         this.programservice.updateProgram(this.editingId,formData).subscribe((res:GymProgram)=>{
          this.Toastr.success("Program editted")
         },
         (err)=>{
           console.log(err.error)
         }
        )
      };
     
    } else {
      console.log('Form is invalid or no image selected');
      this.Toastr.error('Please fill in all fields and select an image');
    }
  }
  Edit(id:number):void{
    this.isEdit=true;
    console.log(id);
    this.editingId=id
    this.programservice.getProgramById(id).subscribe(
      (response: GymProgram)=>{
          this.NewProgramForm.patchValue({
            Name:response.name,
            Description:response.description,
            Category:response.category,
            Fees:response.fees
          }) 
      },
      (err: any)=>{
        console.log(err)
      }
    )
  }
  clearForm(){
    this.NewProgramForm.reset()
    this.isEdit=false;
  }


  Remove(id:number):void
  {
         this.programservice.DeleteProgram(id).subscribe(
          (reponse)=>{
            this.Toastr.success("Program Deleted Successfully")
          },
          (error)=>{
            this.Toastr.error(error.error)
          }
         )
         this.Programs = this.Programs.filter(program => program.id !== id);
  }
 
}
