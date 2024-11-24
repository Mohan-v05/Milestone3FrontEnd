import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../gym-management-system.service';
 // Make sure User interface is imported

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(users: User[], searchTerm: string): User[] {
    if (!searchTerm) {
      return users;  // If searchTerm is empty, return all users
    }

    searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive matching

    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) || // Filter by name
      user.email.toLowerCase().includes(searchTerm) || // Filter by email
      user.nicnumber.toLowerCase().includes(searchTerm) // Filter by NIC number
    );
  }
}
