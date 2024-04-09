import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { Topic } from '../../../topic.model';
import { EventBusService } from '../../../../../service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { Direction, Sort } from '../../../../../../shared/filter/sort.model';
import { Filter, Operator } from '../../../../../../shared/filter/filter.model';
import { TopicFilterChangedEvent } from '../../../topic-module.event';

export const filters = [
  Filter.customOf((e) => true),
  Filter.of('categories.id', Operator.IN , ["b0d093a5-d8ff-4be6-90c3-b372bfe706b1"]),
];

export const sorters = [
  Sort.customOf((e: Topic) => e.voting.likesNumber - e.voting.dislikesNumber, Direction.DESC),
  Sort.of('createdDate', Direction.DESC),
];

@Component({
  selector: 'topic-filter',
  standalone: true,
  imports: [],
  templateUrl: './topic-filter.component.html',
})
export class TopicFilterComponent implements OnChanges {
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);

  @Input() items!: Topic[];
  @Output() outputItmes = new EventEmitter<Topic[]>();

  activeFilter: Filter<Topic> = filters[0];
  activeSorter: Sort<Topic> = sorters[0];

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshItems();
  }

  changeSorter(event: any) {
    this.logger.debug(TopicFilterComponent.name, "changeSorter()");
    this.activeSorter = sorters[event.target.value];
    this.refreshItems();
  }
  
  changeFilter(event: any) {
    this.logger.debug(TopicFilterComponent.name, "changeFilter()");
    this.activeFilter = filters[event.target.value];
    this.refreshItems();
    this.eventBus.emit(TopicFilterChangedEvent.name, new TopicFilterChangedEvent(this.activeFilter));
  }

  refreshItems() {
    this.logger.debug(TopicFilterComponent.name, "refreshItems()");
    this.outputItmes.emit(this.items.filter(this.activeFilter.getPredicateFunction())?.sort(this.activeSorter.getCompareeFunction()));
  }
}
