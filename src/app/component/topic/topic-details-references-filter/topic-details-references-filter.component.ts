import { Component } from '@angular/core';
import { Reference } from '../../../model/topic.model';
import { EventBusService } from '../../../service/event-bus.service';
import { TopicDetailsFilterChangedEvent } from '../topic-module.event';

export const filters = [
  (item: Reference) => true
];

export const sorters = [
  (e1: Reference, e2: Reference) => (e2.likesNumber - e2.dislikesNumber) - (e1.likesNumber - e1.dislikesNumber),
  (e1: Reference, e2: Reference) => (e1.publicationDate ?? new Date()) <= (e2.publicationDate ?? new Date()) ,
  (e1: Reference, e2: Reference) => e1.createdDate < e2.createdDate,
];

@Component({
  selector: 'topic-details-references-filter',
  standalone: true,
  imports: [],
  templateUrl: './topic-details-references-filter.component.html',
  styleUrl: './topic-details-references-filter.component.scss'
})
export class TopicDetailsReferencesFilterComponent {
  filter: string = "0";
  sorter: string = "0";

  constructor(
    private eventBus: EventBusService
  ) { }

  changeSorter(event: any) {
    this.sorter = event.target.value;
    this.eventBus.emit(TopicDetailsFilterChangedEvent.name, new TopicDetailsFilterChangedEvent(Number(this.sorter), Number(this.filter)));
  }
}
