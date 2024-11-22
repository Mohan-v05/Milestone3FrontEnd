import { Component, OnInit } from '@angular/core';
import { GymManagementSystemService, Payments, User, enrollmentreq, gprograms } from '../../gym-management-system.service';
import { Toast } from 'ngx-toastr';
import { trigger, style, animate, transition } from '@angular/animations';
import { jwtDecode } from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class DashboardComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}
  toggleGraph() {
    this.showGraph = !this.showGraph; // Toggle the state
    if (this.showGraph) {
      this.processPaymentData(); // Process data when opening the graph
    }
  }
 
 
  EnrollmentForm: FormGroup;

  paymentResponse: Payments[] = [];
  UsersResponse: User[] = [];
  Members:User[]=[];
  ProgramResponse: gprograms[]=[];

  // Chart-related properties
  showGraph: boolean = false
  view: [number, number] = [800, 450];
  single: any[] = []
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Income';
  colorScheme: string = 'vivid';


  //MemberProfile realted 
  selectedMember: any = null;

  //enroll div 
  isenroll=false;


  // Business-related properties
  totalGymRevenue: number = 0;
  monthlyIncome: number = 0;
  annualIncome: number = 0;
  dailyIncome: number = 0;

  totalMembersCount: number = 0
  activeMembersCount: number = 0;
  
  membersWithDue:number=0

  memberId: string = '';

  

  GetAllPayments() {
    this.service.GetAllPayments().subscribe((data) => {
      console.log(data);
      this.paymentResponse = data
      this.calculateIncomes(this.paymentResponse)
    },
      (Err) => {
        console.log(Err.console.error());

      })
  };

  calculateIncomes(payments: Payments[]): void {
    // Reset income values to avoid duplicate accumulation
    this.totalGymRevenue = 0;
    this.dailyIncome = 0;
    this.monthlyIncome = 0;
    this.annualIncome = 0;
  
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get only the date part (YYYY-MM-DD)
  
    payments.forEach((payment) => {
      // Add to total revenue
      this.totalGymRevenue += payment.amount;
  
      const paymentDate = new Date(payment.dateTime);
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDayString = paymentDate.toISOString().split('T')[0];
  
      // Add to annual income if payment is from the current year
      if (paymentYear === today.getFullYear()) {
        this.annualIncome += payment.amount;
      }
  
      // Add to monthly income if payment is from the current month
      if (
        paymentYear === today.getFullYear() &&
        paymentMonth === today.getMonth()
      ) {
        this.monthlyIncome += payment.amount;
      }
  
      // Add to daily income if payment is from today
      if (paymentDayString === todayString) {
        this.dailyIncome += payment.amount;
      }
    });
  }



  GetAllMembers() {
    this.service.getUsers().subscribe(
      (data) => {
        console.log(data);
        this.UsersResponse = data
        this.Members=data.filter(u=>u.role==2)
        this.totalMembersCount= this.Members.length
       
        this.GetActiveMember( this.Members)
        this. GetNotPaidMembers( this.Members)
      },
      (err) => {
        console.log(err.error);
      }
    )
  }

  GetActiveMember(Array:User[]){
    console.log(Array)
    this.activeMembersCount=Array.filter(u=>u.isActivated==true).length
  }

  GetNotPaidMembers(users: User[]): void {
    this.membersWithDue = users.filter(
      (u) => new Date(u.expiryDate).getTime() < Date.now()).length ;
  }
  
//programs 
GetAllPrograms(){
  this.service.getPrograms().subscribe(data=>{
    this.ProgramResponse=data
    console.log(data)
  })
}


  processPaymentData(): void {
    // Explicitly define the structure of monthlyIncome
    const monthlyIncome: Record<string, number> = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    this.paymentResponse.forEach(payment => {
      const date = new Date(payment.dateTime);
      
      console.log(date)


      if (!isNaN(date.getTime())) {
        const month = date.toLocaleString('default', { month: 'long' });
        console.log(month);
        if (monthlyIncome[month] !== undefined) {
          monthlyIncome[month] += payment.amount;
        }
      }
    });
    console.log(monthlyIncome)
    this.single = Object.keys(monthlyIncome).map(month => (
      {
        name: month,
        value: monthlyIncome[month]
      }
    ));
  }



  constructor(private service: GymManagementSystemService, private Fb:FormBuilder) {
    this.EnrollmentForm=this.Fb.group({
      UserId:[,Validators.required,],
      Programs:[''],
     
   })
   }

  ngOnInit(): void {
   
    this.GetAllPayments(),
    this.GetAllMembers(),
    this.GetAllPrograms()
  }

  viewMemberInfo(): void {
    const member = this.UsersResponse.find(u => u.id === Number(this.memberId));
    this.selectedMember=member;
    this.EnrollmentForm.patchValue({
      UserId:this.selectedMember.id
    })
   
  }

  Enrollmentreq : enrollmentreq={
    userId: 0,
    programIds: []
  }
  //Enroll Members 
  EnrollMemberstoPrograms(){
    this.isenroll=!this.isenroll
    console.log(this.EnrollmentForm.value)
    
  }

}
