import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PathDetailsComponent } from '../path-details/path-details.component';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { HidePathDetailsModalEvent, ShowPathDetailsModalEvent } from '../path-module.event';

@Component({
  selector: 'path-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    PathDetailsComponent,
  ],
  templateUrl: './path-details-modal.component.html',
  styleUrl: './path-details-modal.component.scss'
})
export class PathDetailsModalComponent {
  eventBus = inject(EventBusService); 
  modalId?: string;
  modalVisable: boolean = false;
  
  ngOnInit(): void {
    this.eventBus.listen(ShowPathDetailsModalEvent.name, (event: ShowPathDetailsModalEvent) => this.showModal(event.modelId));
    this.eventBus.listen(HidePathDetailsModalEvent.name, (event: HidePathDetailsModalEvent) => this.hideModal());
  }

  showModal(modalId: string) {
    this.modalId = modalId;
    this.modalVisable = true;
  }
  hideModal() {
    this.modalVisable = false;
  }
}
