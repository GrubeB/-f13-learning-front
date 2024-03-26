import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loginViewViable: boolean = false;
  
  showLoginView() {
    if (this.loginViewViable) {
      this.loginViewViable = false;
    } else {
      this.loginViewViable = true;
    }
  }

  hideLoginView() {
    this.loginViewViable = false;
  }
}
