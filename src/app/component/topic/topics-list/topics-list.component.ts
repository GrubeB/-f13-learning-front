import { Component, Input } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { CommonModule } from '@angular/common';
import { TopicsListItemComponent } from '../topics-list-item/topics-list-item.component';

@Component({
  selector: 'topics-list',
  standalone: true,
  imports: [
    CommonModule,
    TopicsListItemComponent
  ],
  templateUrl: './topics-list.component.html',
  styleUrl: './topics-list.component.css'
})
export class TopicsListComponent {
  @Input() topics!: Topic[];
}
