import { Component, Input } from '@angular/core';
import { Topic } from '../../topic.model';
import { CommonModule } from '@angular/common';
import { TopicListItemComponent } from './topic-list-item/topic-list-item.component';
import { TopicListItemContextMenuComponent } from './topic-list-item/topic-list-item-context-menu/topic-list-item-context-menu.component';
import { Vote } from '../../../voting/vote.model';
import { TopicFilterComponent } from './topic-filter/topic-filter.component';

@Component({
  selector: 'topic-list',
  standalone: true,
  imports: [
    CommonModule,
    TopicListItemComponent,
    TopicFilterComponent,
  ],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.scss'
})
export class TopicListComponent {
  @Input() topics!: Topic[];
  filtredTopics!:Topic[];
}
