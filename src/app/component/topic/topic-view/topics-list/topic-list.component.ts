import { Component, Input } from '@angular/core';
import { Topic } from '../../topic.model';
import { CommonModule } from '@angular/common';
import { TopicListItemComponent } from './topic-list-item/topic-list-item.component';
import { TopicListItemContextMenuComponent } from './topic-list-item/topic-list-item-context-menu/topic-list-item-context-menu.component';

@Component({
  selector: 'topic-list',
  standalone: true,
  imports: [
    CommonModule,
    TopicListItemComponent,
    TopicListItemContextMenuComponent
  ],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.scss'
})
export class TopicListComponent {
  @Input() topics!: Topic[];
}
