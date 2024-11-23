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

  displayedColumns: string[] = ['id', 'payee', 'payer', 'dateTime', 'amount', 'paymentType'];

  dataSource = new MatTableDataSource<Payments>(this.AllPayments);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: GymManagementSystemService) { }

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
    this.service.GetAllPayments().subscribe((data: Payments[]) => {
      this.AllPayments = data;
      this.dataSource.data = this.AllPayments; // Update the dataSource after fetching the payments
      console.log(this.AllPayments); // Log payments to check the response
    }, error => {
      console.error('Error fetching payments:', error);
    });
  }
}
