import { Component, Input } from '@angular/core';
import { Category } from '../category.model';
import { CommonModule } from '@angular/common';
import { CategoriesListItemComponent } from './category-list-item/category-list-item.component';
import { mergeDeep } from '../../../shared/utils/merge';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesListItemComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoriesListComponent {
  @Input() categories!: Category[];

  // CONFIG
  @Input() set config(config: any) {
    this._config = mergeDeep(this._config, config);
  }
  _config: Config = {
    items: {
      contextMenu: {
        enable: true,
      },
      voting: true,
      open: true,
    }
  }
}

class Config {
  items!: {
    contextMenu: {
      enable: boolean;
    };
    voting: boolean;
    open: boolean;
  }
}