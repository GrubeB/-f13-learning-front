import { Component, Input } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'topics-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './topics-list-item.component.html',
  styleUrl: './topics-list-item.component.css'
})
export class TopicsListItemComponent {
  @Input() topic!: Topic;
}
