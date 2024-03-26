import { Component, EventEmitter, Output } from '@angular/core';
import { LoginButtonComponent } from './login-button/login-button.component';
import { CommonModule } from '@angular/common';
import { EmailLoginFormComponent } from './email-login-form/email-login-form.component';
import { DividerComponent } from '../../shared/divider/divider.component';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    LoginButtonComponent,
    EmailLoginFormComponent,
    DividerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() hide = new EventEmitter<any>();

  activeProvider: string | null = "email";
  providers = [
    {
      name: 'google',
      displayName: 'Google',
      icon: 'bi-google',
      enable: false,
    },
    {
      name: 'discord',
      displayName: 'Discord',
      icon: 'bi-discord',
      enable: false,
    },
    {
      name: 'facebook',
      displayName: 'Facebook',
      icon: 'bi-messenger',
      enable: false,
    },
    {
      name: 'email',
      displayName: 'Email',
      icon: 'bi-envelope-at-fill',
      enable: true,
    },
    {
      name: 'phone',
      displayName: 'Phone',
      icon: 'bi-phone-fill',
      enable: false,
    }
  ];
  constructor() {
  }

  setActiveProvider(providerName: string) {
    console.log("setActiveProvider");
    this.activeProvider = providerName;
  }
  close(){
    this.hide.emit();
  }
}
