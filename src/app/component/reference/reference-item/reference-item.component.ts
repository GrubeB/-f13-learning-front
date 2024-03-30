import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Reference } from '../../../model/topic.model';

@Component({
  selector: 'reference-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './reference-item.component.html',
  styleUrl: './reference-item.component.scss'
})
export class ReferenceItemComponent {
  @Input() reference!: Reference;
  openReference(): void {
    window.open(this.reference.link, '_blank');
  }
}
