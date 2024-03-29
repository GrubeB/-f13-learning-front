import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'login-button',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
  @Input() name!: string;
  @Input() text!: string;
  @Input() icon!: string;
  @Input() disabled : boolean = false;
  @Output() action = new EventEmitter<string>();

  get iconClass() {
    return ['bi', this.icon];
  }
}
