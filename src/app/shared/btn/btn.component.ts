import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn',
  standalone: true,
  imports: [],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss'
})
export class BtnComponent {
  @Input() text?: string;
  @Input() disabled : boolean = false;
  @Output() action = new EventEmitter<void>();
}
