import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'email-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './email-login-form.component.html',
  styleUrl: './email-login-form.component.css'
})
export class EmailLoginFormComponent {
  loginFormGroup = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });

  login(){
    console.log(this.loginFormGroup.value);
  }
}
