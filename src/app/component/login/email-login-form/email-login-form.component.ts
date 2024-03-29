import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../auth/authentication.service';
import { first } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'email-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './email-login-form.component.html',
  styleUrl: './email-login-form.component.scss'
})
export class EmailLoginFormComponent {
  logger: NGXLogger = inject(NGXLogger);
  authService: AuthenticationService = inject(AuthenticationService);

  @Output() onSuccessLogin = new EventEmitter<any>();
  message?:string;
  
  loginFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });


  login() {
    const email = this.loginFormGroup.get('email')?.value;
    const password = this.loginFormGroup.get('password')?.value;
    if (email != null && password != null) {
      this.authService.login(email, password)
        .pipe(first())
        .subscribe({
          next: response => {
            this.logger.debug("user logging in");
            this.onSuccessLogin.emit();
          },
          error: e => {
            this.logger.error("error occurred while logging in user ", e);
            this.message = "Bad credencial";
          }
        }
        )
    }
  }
}
