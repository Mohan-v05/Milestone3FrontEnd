import { Component, OnInit } from '@angular/core';
import { GymManagementSystemService, Payments, User, enrollmentreq, gprograms } from '../../gym-management-system.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddPaymentComponent } from '../../add-payment/add-payment.component';

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
  bsModalRef!: BsModalRef;

  // MemberProfile related
  selectedMember: any = null;
  totalMembersCount: number = 0;
  activeMembersCount: number = 0;
  membersWithDue: number = 0;
  Members: User[] = [];
  UsersResponse: User[] = [];
  memberId: string = '';

  // Program-related properties
  ProgramResponse: gprograms[] = [];
  EnrollmentForm: FormGroup;
  isenroll = false;
  Enrollmentreq: { userId: number; programIds: number[] } = {
    userId: 0,
    programIds: [],
  };

  // Payment-related properties
  PaymentForm: FormGroup;
  paymentResponse: Payments[] = [];
  isPaymentFormVisible: boolean = false;
  totalGymRevenue: number = 0;
  monthlyIncome: number = 0;
  annualIncome: number = 0;
  dailyIncome: number = 0;

  // Chart-related properties
  showGraph: boolean = false;
  view: [number, number] = [800, 450];
  single: any[] = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Income';
  colorScheme: string = 'vivid';

  constructor(
    private service: GymManagementSystemService,
    private Fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService
  )
   {
    this.EnrollmentForm = this.Fb.group({
      UserId: [, Validators.required],
      Programs: this.Fb.array([])
    });
    this.PaymentForm = this.Fb.group({
      memberid: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      paymentType: [1, [Validators.required]],
      anyDiscount: [0, [Validators.min(0)]],
      remarks: [''],
      recievedBy: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.GetAllPayments();
    this.GetAllMembers();
    this.GetAllPrograms();
  }

  // Member-related functions
  GetAllMembers() {
    this.service.getUsers().subscribe(
      (data) => {
        console.log(data);
        this.UsersResponse = data;
        this.Members = data.filter(u => u.role == 2);
        this.totalMembersCount = this.Members.length;

        this.GetActiveMember(this.Members);
        this.GetNotPaidMembers(this.Members);
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  GetActiveMember(Array: User[]) {
    console.log(Array);
    this.activeMembersCount = Array.filter(u => u.isActivated == true).length;
  }

  GetNotPaidMembers(users: User[]): void {
    this.membersWithDue = users.filter(
      (u) => new Date(u.expiryDate).getTime() < Date.now()).length;
  }

  viewMemberInfo(): void {
    const member = this.UsersResponse.find(u => u.id === Number(this.memberId));
    this.selectedMember = member;
    console.log(this.selectedMember);

    this.EnrollmentForm.patchValue({
      UserId: this.selectedMember.id
    });
  }

  // Program-related functions
  GetAllPrograms() {
    this.service.getPrograms().subscribe(data => {
      this.ProgramResponse = data;
      console.log(data);
    });
  }

  get Programs(): FormArray {
    return this.EnrollmentForm.get('Programs') as FormArray;
  }

  onCheckboxChange(event: any, programId: number) {
    const programsArray: FormArray = this.Programs;
    if (event.target.checked) {
      programsArray.push(this.Fb.control(programId));
    } else {
      const index = programsArray.controls.findIndex(
        (control) => control.value === programId
      );
      if (index !== -1) {
        programsArray.removeAt(index);
      }
    }
  }

  EnrollMemberstoPrograms() {
    this.isenroll = !this.isenroll;
  }

  postdata() {
    this.Enrollmentreq.userId = this.EnrollmentForm.value.UserId;
    this.Enrollmentreq.programIds = this.Programs.value;
    this.service.AddEnrollments(this.Enrollmentreq).subscribe(
      (data) => {
        this.toastr.success('Enrollment successful', 'Success');
        console.log(data);
      },
      (err) => {
        this.toastr.error(err.error, 'Error');
      }
    );
    console.log('Enrollment Request:', this.Enrollmentreq);
  }

  Removeenrollment(guid: string) {
    console.log(guid);
    this.service.deleteEnrollment(guid).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success('Enrollment Deleted');
      },
      (err) => {
        console.log(err.error);
        this.toastr.error('Error while Deleting Enrollment');
      }
    );
  }

  // Payment-related functions
  GetAllPayments() {
    this.service.GetAllPayments().subscribe(
      (data) => {
        if (data) {
          console.log(data);
          this.paymentResponse = data;
          this.calculateIncomes(this.paymentResponse);
        } else {
          console.log("No any Payments");
        }
      },
      (Err) => {
        console.log(Err.console.error());
      }
    );
  }

  calculateIncomes(payments: Payments[]): void {
    this.totalGymRevenue = 0;
    this.dailyIncome = 0;
    this.monthlyIncome = 0;
    this.annualIncome = 0;

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    payments.forEach((payment) => {
      this.totalGymRevenue += payment.amount;

      const paymentDate = new Date(payment.dateTime);
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDayString = paymentDate.toISOString().split('T')[0];

      if (paymentYear === today.getFullYear()) {
        this.annualIncome += payment.amount;
      }

      if (paymentYear === today.getFullYear() && paymentMonth === today.getMonth()) {
        this.monthlyIncome += payment.amount;
      }

      if (paymentDayString === todayString) {
        this.dailyIncome += payment.amount;
      }
    });
  }

  processPaymentData(): void {
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

      if (!isNaN(date.getTime())) {
        const month = date.toLocaleString('default', { month: 'long' });
        if (monthlyIncome[month] !== undefined) {
          monthlyIncome[month] += payment.amount;
        }
      }
    });

    this.single = Object.keys(monthlyIncome).map(month => (
      {
        name: month,
        value: monthlyIncome[month]
      }
    ));
  }

  OpenPaymentForm() {
    this.isPaymentFormVisible = !this.isPaymentFormVisible;
  }

  onPayment() {
    this.PaymentForm.value.paymentType = parseInt(this.PaymentForm.value.paymentType);
    this.service.AddPayment(this.PaymentForm.value).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success(data.description);
        this.ngOnInit();
      },
      (err) => {
        this.toastr.error('Payment Failed');
        console.log(err.error);
      }
    );
    console.log('Payment submitted:', this.PaymentForm.value);
  }

  openModalWithComponent() {
    const initialState: ModalOptions = {
      initialState: {}
    };
    this.bsModalRef = this.modalService.show(AddPaymentComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  //chart related functions
  toggleGraph() {
    this.showGraph = !this.showGraph;
    if (this.showGraph) {
      this.processPaymentData();
    }
  }
}
