import { Component, Input } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { CommonModule } from '@angular/common';
import { TopicsListItemComponent } from '../topics-list-item/topics-list-item.component';
import { TopicListItemContextMenuComponent } from '../topic-list-item-context-menu/topic-list-item-context-menu.component';

@Component({
  selector: 'topics-list',
  standalone: true,
  imports: [
    CommonModule,
    TopicsListItemComponent,
    TopicListItemContextMenuComponent
  ],
  templateUrl: './topics-list.component.html',
  styleUrl: './topics-list.component.scss'
})
export class TopicsListComponent {
  @Input() topics!: Topic[];
}
