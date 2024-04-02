import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AuthenticationService } from './auth/authentication.service';
import { take } from 'rxjs';

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
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  loginViewViable: boolean = false;

  ngOnInit(): void {
    this.authenticationService.login("ala@ma.kota", "password4$A")
      .pipe(take(1)).subscribe({});
  }
  
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
