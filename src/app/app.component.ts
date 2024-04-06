import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AuthenticationService } from './auth/authentication.service';
import { take } from 'rxjs';
import { UserProfileComponent } from './component/user/user-profile/user-profile.component';
import { User } from './component/user/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LoginComponent,
    UserProfileComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  loginViewViable: boolean = false;

  curentUser?: User;

  ngOnInit(): void {
    // TODO to remove
    this.authenticationService.login("ala@ma.kota", "password4$A")
      .pipe(take(1)).subscribe({});
      
    this.authenticationService.authenticationContext$().subscribe({
      next: data => {
        this.curentUser = data?.userModel;
      }
    })
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
