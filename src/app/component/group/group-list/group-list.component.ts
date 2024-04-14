import { Component, Input } from '@angular/core';
import { Group } from '../group.model';
import { GroupListItemComponent } from './group-list-item/group-list-item.component';
import { CommonModule } from '@angular/common';
import { mergeDeep } from '../../../shared/utils/merge';

@Component({
  selector: 'group-list',
  standalone: true,
  imports: [
    CommonModule,
    GroupListItemComponent,
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent {
  @Input() groups!: Group[];
  filtredGroups!: Group[];

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