import { Component } from '@angular/core';
import {  ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var AOS: any;
@Component({
  selector: 'app-blank-layout',
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})

export class BlankLayoutComponent implements OnInit {
 
  notlogin: boolean=true;
  isModalVisible: boolean = false;
  bmiResult: any;
 

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {  
    AOS.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: true, 
    });
  }
 
  loginfunction(){
    this.notlogin=!this.notlogin
  }

  ngOnDestroy(): void {
  
  }

 

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  // Handle form submission
  onSubmit(form: any): void {
    const heightInMeters = form.value.height / 100; // Convert height from cm to meters
    const weightInKg = form.value.weight;

    // Calculate BMI
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    // Body Fat Percentage (simple estimate based on BMI)
    let bodyFatPercentage = 0;
    if (bmi < 18.5) {
      bodyFatPercentage = 10;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      bodyFatPercentage = 15;
    } else {
      bodyFatPercentage = 20;
    }

    // Minimum and Maximum Calorie Intake estimates (simplified formula)
    const minCalorie = weightInKg * 22;  // Minimum calorie intake
    const maxCalorie = weightInKg * 30;  // Maximum calorie intake

    // Store the result
    this.bmiResult = {
      bmi: bmi,
      bodyFatPercentage: bodyFatPercentage,
      minCalorie: minCalorie,
      maxCalorie: maxCalorie
    };
  }
}
