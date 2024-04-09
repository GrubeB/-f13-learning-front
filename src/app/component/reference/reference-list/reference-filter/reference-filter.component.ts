import { Component, inject } from '@angular/core';
import { Reference } from '../../reference.model';
import { EventBusService } from '../../../../service/event-bus.service';
import { TopicDetailsFilterChangedEvent } from '../../../topic/topic-module.event';

export const filters = [
  (item: Reference) => true
];

export const sorters = [
  (e1: Reference, e2: Reference) => (e2.voting.likesNumber - e2.voting.dislikesNumber) - (e1.voting.likesNumber - e1.voting.dislikesNumber),
  (e1: Reference, e2: Reference) => (e1.publicationDate ?? new Date()) <= (e2.publicationDate ?? new Date()) ,
  (e1: Reference, e2: Reference) => e1.createdDate < e2.createdDate,
];

@Component({
  selector: 'reference-filter',
  standalone: true,
  imports: [],
  templateUrl: './reference-filter.component.html',
  styleUrl: './reference-filter.component.scss'
})
export class ReferenceFilterComponent {
  eventBus = inject(EventBusService);
  filter: string = "0";
  sorter: string = "0";

  changeSorter(event: any) {
    this.sorter = event.target.value;
    this.eventBus.emit(TopicDetailsFilterChangedEvent.name, new TopicDetailsFilterChangedEvent(Number(this.sorter), Number(this.filter)));
  }
}
