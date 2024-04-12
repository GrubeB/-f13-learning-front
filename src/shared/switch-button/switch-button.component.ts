import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'switch-button',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './switch-button.component.html',
  styleUrl: './switch-button.component.scss'
})
export class SwitchButtonComponent {
  @Input() value!: boolean;
  @Output() valueChange = new EventEmitter<boolean>();
  
  toTrue() {
    this.value = true;
    this.valueChange.emit(this.value);
  }
  toFalse() {
    this.value = false;
    this.valueChange.emit(this.value);
  }
}
