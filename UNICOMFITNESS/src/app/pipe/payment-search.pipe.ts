import { Pipe, PipeTransform } from '@angular/core';
import { Payments } from '../gym-management-system.service';

@Pipe({
  name: 'paymentSearch'
})
export class PaymentSearchPipe implements  PipeTransform {

  transform(Payments:Payments[], searchTerm: string): Payments[] {
    if (!searchTerm) {
      return Payments;  // If searchTerm is empty, return all users
    }

    searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive matching
    return Payments.filter(user =>
      user.dateTime.toLowerCase().includes(searchTerm)
    );
  }

}
