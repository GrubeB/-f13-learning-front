import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { TopicDetailsComponent } from '../topic-details/topic-details.component';
import { EventBusService } from '../../../shared/service/event-bus.service';
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
  eventBus = inject(EventBusService); 
  modalId?: string;
  modalVisable: boolean = false;

  
  ngOnInit(): void {
    this.eventBus.listen(ShowTopicDetailsModalEvent.name, (event: ShowTopicDetailsModalEvent) => this.showModal(event.topicId));
    this.eventBus.listen(HideTopicDetailsModalEvent.name, (event: HideTopicDetailsModalEvent) => this.hideModal());
  }

  showModal(modalId: string) {
    this.modalId = modalId;
    this.modalVisable = true;
  }
  hideModal() {
    this.modalVisable = false;
  }
}
