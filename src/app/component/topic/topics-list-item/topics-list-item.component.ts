import { Component, Input } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BtnIconComponent } from '../../../../shared/btn-icon/btn-icon.component';
import { EventBusService } from '../../../service/event-bus.service';
import { ShowTopicDetailsModalEvent } from '../topic-module.event';

@Component({
  selector: 'topics-list-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BtnIconComponent,
    DatePipe,
  ],
  templateUrl: './topics-list-item.component.html',
  styleUrl: './topics-list-item.component.scss'
})
export class TopicsListItemComponent {
  @Input() topic!: Topic;

  constructor(
    private eventBus: EventBusService
  ) { }

  openTopicDetailsModal(topicId: string) {
    this.eventBus.emit(ShowTopicDetailsModalEvent.name, new ShowTopicDetailsModalEvent(topicId));
  }
}
