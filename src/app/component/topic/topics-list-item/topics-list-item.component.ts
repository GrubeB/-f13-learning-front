import { Component, Input } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BtnImageComponent } from '../../../../shared/btn-image/btn-image.component';
import { BtnIconComponent } from '../../../../shared/btn-icon/btn-icon.component';

@Component({
  selector: 'topics-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BtnImageComponent,
    BtnIconComponent,
    DatePipe,
  ],
  templateUrl: './topics-list-item.component.html',
  styleUrl: './topics-list-item.component.scss'
})
export class TopicsListItemComponent {
  @Input() topic!: Topic;
}
