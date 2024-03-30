import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TopicDetailsComponent } from '../topic-details/topic-details.component';
import { EventBusService } from '../../../service/event-bus.service';
import { HideTopicDetailsModalEvent, ShowTopicDetailsModalEvent } from '../topic-module.event';

@Component({
  selector: 'topic-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    TopicDetailsComponent
  ],
  templateUrl: './topic-details-modal.component.html',
  styleUrl: './topic-details-modal.component.scss'
})
export class TopicDetailsModalComponent implements OnInit {
  topicId?: string;
  modalVisable: boolean = false;

  constructor(
    private eventBus: EventBusService
  ) { }
  
  ngOnInit(): void {
    this.eventBus.listen(ShowTopicDetailsModalEvent.name, (event: ShowTopicDetailsModalEvent) => this.showModal(event.topicId));
    this.eventBus.listen(HideTopicDetailsModalEvent.name, (event: HideTopicDetailsModalEvent) => this.hideModal());
  }

  showModal(topicId: string) {
    this.topicId = topicId;
    this.modalVisable = true;
  }
  hideModal() {
    this.modalVisable = false;
  }
}
