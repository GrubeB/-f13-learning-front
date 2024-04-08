import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vote } from '../vote.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'simple-liking',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './simple-liking.component.html',
  styleUrl: './simple-liking.component.scss'
})
export class SimpleLikingComponent {
  @Output() like = new EventEmitter<void>();
  @Output() removeLike = new EventEmitter<void>();
  @Input() vote?: Vote;
}
