import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn-icon',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './btn-icon.component.html',
  styleUrl: './btn-icon.component.scss'
})
export class BtnIconComponent {
  @Input() icon: string = "box";
  @Input() text?: string;
  @Input() disabled : boolean = false;
  @Output() action = new EventEmitter<void>();

  get iconClass() {
    return ['bi', this.icon];
  }
}
