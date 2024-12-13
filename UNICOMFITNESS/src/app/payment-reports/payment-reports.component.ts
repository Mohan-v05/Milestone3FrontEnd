import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GymManagementSystemService, PaymentType, Payments } from '../gym-management-system.service';

@Component({
  selector: 'app-payment-reports',
  templateUrl: './payment-reports.component.html',
  styleUrls: ['./payment-reports.component.css']
})
export class PaymentReportsComponent implements AfterViewInit, OnInit {
  AllPayments: Payments[] = [];
  selectedDate: string = ''; // Date selected from the input
  dailyIncome: number = 0;
  monthlyIncome: number = 0;
  yearlyIncome: number = 0;
   
  DisplayIncome:number=0;

  displayedColumns: string[] = ['id', 'payer', 'payee', 'dateTime', 'amount', 'paymentType'];
  dataSource = new MatTableDataSource<Payments>(this.AllPayments);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: GymManagementSystemService) {}

  ngOnInit(): void {
    // Fetch payments after component is initialized
    this.FetchAllPayments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Method to get Payment Type as a readable string
  getPaymentType(paymentType: number): string {
    switch (paymentType) {
      case PaymentType.InitialPayment:
        return 'Initial Payment';
      case PaymentType.Monthly:
        return 'Monthly';
      case PaymentType.Annual:
        return 'Annual';
      default:
        return 'Unknown';
    }
  }

  // Fetch all payments from the service
  FetchAllPayments() {
    this.service.GetAllPayments().subscribe(
      (data: Payments[]) => {
        this.AllPayments = data;
        this.dataSource.data = this.AllPayments; // Update the dataSource after fetching the payments
        console.log(this.AllPayments); // Log payments to check the response
      },
      (error) => {
        console.error('Error fetching payments:', error);
      }
    );
  }

 // Calculate daily income
calculateDayincome() {
  if (!this.selectedDate) {
    console.error("Please select a date.");
    return;
  }

  this.dailyIncome = this.AllPayments
    .filter(payment => payment.dateTime.startsWith(this.selectedDate))
    .reduce((sum, payment) => sum + payment.amount, 0);

  this.DisplayIncome = this.dailyIncome; // Set DisplayIncome to dailyIncome
  console.log('Daily Income:', this.dailyIncome);
}

// Calculate monthly income
calculateMonthincome() {
  const selectedMonth = this.selectedDate.slice(0, 7); // Extract year-month from selectedDate (YYYY-MM)
  this.monthlyIncome = this.AllPayments
    .filter(payment => payment.dateTime.startsWith(selectedMonth))
    .reduce((sum, payment) => sum + payment.amount, 0);

  this.DisplayIncome = this.monthlyIncome; // Set DisplayIncome to monthlyIncome
  console.log('Monthly Income:', this.monthlyIncome);
}

// Calculate yearly income
calculateYearlyincome() {
  const selectedYear = this.selectedDate.slice(0, 4); // Extract year from selectedDate (YYYY)
  this.yearlyIncome = this.AllPayments
    .filter(payment => payment.dateTime.startsWith(selectedYear))
    .reduce((sum, payment) => sum + payment.amount, 0);

  this.DisplayIncome = this.yearlyIncome; // Set DisplayIncome to yearlyIncome
  console.log('Yearly Income:', this.yearlyIncome);
}

}
