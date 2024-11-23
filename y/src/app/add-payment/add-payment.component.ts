import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.css'
})
export class AddPaymentComponent {
  PaymentForm:FormGroup;

  constructor(private Fb:FormBuilder){
    this.PaymentForm=this.Fb.group({
      memberid: [null, [Validators.required]],           
      amount: [null, [Validators.required, Validators.min(0)]],
      paymentType: [1, [Validators.required]],       
      anyDiscount: [0, [Validators.min(0)]],            
      remarks: [''],                                    
      recievedBy: [null, [Validators.required]],        
      quantity: [1, [Validators.required, Validators.min(1)]], 
    });
  }
  
      onPayment(){
        console.log('Payment submitted:', this.PaymentForm.value);
      }

}

