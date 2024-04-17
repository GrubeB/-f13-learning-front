import { Component, Input } from '@angular/core';
import { Path } from '../path.model';
import { mergeDeep } from '../../../shared/utils/merge';
import { CommonModule } from '@angular/common';
import { PathListItemComponent } from './path-list-item/path-list-item.component';

@Component({
  selector: 'path-list',
  standalone: true,
  imports: [
    CommonModule,
    PathListItemComponent,
  ],
  templateUrl: './path-list.component.html',
  styleUrl: './path-list.component.scss'
})
export class PathListComponent {
  @Input() items!: Path[];
  filtredItems!: Path[];

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