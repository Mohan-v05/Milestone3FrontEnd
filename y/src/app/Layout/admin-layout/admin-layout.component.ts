import { Component } from '@angular/core';
import { ChatGptService } from '../../chat-gpt.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  response: string = '';
  userPrompt: string = '';
  loggedInUser:string="mohan"
  isSidebarOpen: boolean = true; 
constructor(private chatGptService: ChatGptService){

}
sendMessageToChatGpt(prompt: string) {
  this.chatGptService.sendMessage(prompt).subscribe(
    (data) => {
      this.response = data.choices[0].message.content;
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle the sidebar open/close state
  }
}
