import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalGymRevenue: number = 50000; // Example value
  monthlyIncome: number = 5000; // Example value
  annualIncome: number = 60000; // Example value
  dailyIncome: number = 150; // Example value
  totalMembersCount: number = 120; // Example value
  activeMembersCount: number = 100; // Example value
  memberId: string = '';

  constructor() { }

  ngOnInit(): void { }

  viewMemberInfo(): void {
    // Fetch and display member info based on the entered member ID
    console.log('Fetching member info for ID:', this.memberId);
  }
}
