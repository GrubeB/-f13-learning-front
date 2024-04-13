import { Component, Input } from '@angular/core';
import { Topic } from '../topic.model';
import { CommonModule } from '@angular/common';
import { TopicListItemComponent } from './topic-list-item/topic-list-item.component';
import { TopicListItemContextMenuComponent } from './topic-list-item/topic-list-item-context-menu/topic-list-item-context-menu.component';
import { Vote } from '../../voting/vote.model';
import { TopicFilterComponent } from './topic-filter/topic-filter.component';
import { mergeDeep } from '../../../shared/utils/merge';

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
  filtredTopics!: Topic[];

  // CONFIG
  @Input() set config(config: any) {
    this._config = mergeDeep(this._config, config);
  }
  _config: Config = {
    filter: true,
    items: {
      contextMenu: {
        enable: true,
      },
      modal: true,
      voting: true,
      open: true,
    }
  }
}

class Config {
  filter!: boolean;
  items!: {
    contextMenu: {
      enable: boolean;
    };
    modal: boolean;
    voting: boolean;
    open: boolean;
  }
}
