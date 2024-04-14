import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GroupDetailsComponent } from '../group-details/group-details.component';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { HideGroupDetailsModalEvent, ShowGroupDetailsModalEvent } from '../group-module.event';

@Component({
  selector: 'group-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    GroupDetailsComponent,
  ],
  templateUrl: './group-details-modal.component.html',
  styleUrl: './group-details-modal.component.scss'
})
export class GroupDetailsModalComponent {
  eventBus = inject(EventBusService); 
  modalId?: string;
  modalVisable: boolean = false;
  
  ngOnInit(): void {
    this.eventBus.listen(ShowGroupDetailsModalEvent.name, (event: ShowGroupDetailsModalEvent) => this.showModal(event.modelId));
    this.eventBus.listen(HideGroupDetailsModalEvent.name, (event: HideGroupDetailsModalEvent) => this.hideModal());
  }

  showModal(modalId: string) {
    this.modalId = modalId;
    this.modalVisable = true;
  }
  hideModal() {
    this.modalVisable = false;
  }
}
