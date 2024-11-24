import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GymManagementSystemService } from '../gym-management-system.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.css'
})
export class AddPaymentComponent {
  PaymentForm: FormGroup;

  constructor(private Fb:FormBuilder,private service:GymManagementSystemService, private toastr:ToastrService){
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
 
  onPayment() {
    this.PaymentForm.value.paymentType = parseInt(this.PaymentForm.value.paymentType);
    this.service.AddPayment(this.PaymentForm.value).subscribe((data) => {
      console.log(data);
      this.toastr
    },
      (err) => {
        this.toastr.error('Payment Failed');
        console.log(err.error);
      }
    );
    console.log('Payment submitted:', this.PaymentForm.value);
  }

}

