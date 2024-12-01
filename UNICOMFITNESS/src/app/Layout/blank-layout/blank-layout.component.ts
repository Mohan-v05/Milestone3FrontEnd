import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

declare var AOS: any;
@Component({
  selector: 'app-blank-layout',
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})

export class BlankLayoutComponent implements OnInit {
  ngOnInit(): void {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }
}
