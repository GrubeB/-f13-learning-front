import { Component, Input, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CommonModule } from '@angular/common';
import { SwitchButtonComponent } from '../../../shared/component/switch-button/switch-button.component';
import { Category } from '../category.model';
import { CategoriesListComponent } from '../category-list/category-list.component';

@Component({
  selector: 'category-section',
  standalone: true,
  imports: [
    CommonModule,
    SwitchButtonComponent,
    CategoriesListComponent,
  ],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.scss'
})
export class CategorySectionComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() label?: string;
  @Input() items!: Category[];

  // HIDDE CONTENT
  contentHidden: boolean = false;
}