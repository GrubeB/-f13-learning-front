import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { Reference } from '../../reference.model';
import { EventBusService } from '../../../../service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { Filter } from '../../../../../shared/filter/filter.model';
import { Direction, Sort } from '../../../../../shared/filter/sort.model';

@Component({
  selector: 'reference-filter',
  standalone: true,
  imports: [],
  templateUrl: './reference-filter.component.html',
})
export class ReferenceFilterComponent implements OnChanges{
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  @Input() items!: Reference[];
  @Output() outputItmes = new EventEmitter<Reference[]>();

  filters: (() => Filter<Reference>)[] = [
    () => Filter.customOf((e) => true),
  ];

  sorters: (() => Sort<Reference>)[] = [
    () => Sort.customOf((e: Reference) => e.voting.likesNumber - e.voting.dislikesNumber, Direction.DESC),
    () => Sort.of('publicationDate', Direction.DESC),
    () => Sort.of('createdDate', Direction.DESC),
  ];

  activeFilter: Filter<Reference> = this.filters[0]();
  activeSorter: Sort<Reference> = this.sorters[0]();

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshItems();
  }

  changeSorter(event: any) {
    this.logger.debug(ReferenceFilterComponent.name, "changeSorter()");
    this.activeSorter = this.sorters[event.target.value]();
    this.refreshItems();
  }

  changeFilter(event: any) {
    this.logger.debug(ReferenceFilterComponent.name, "changeFilter()");
    this.activeFilter = this.filters[event.target.value]();
    this.refreshItems();
  }

  refreshItems() {
    this.logger.debug(ReferenceFilterComponent.name, "refreshItems()");
    this.outputItmes.emit(this.items.filter(this.activeFilter.getPredicateFunction())?.sort(this.activeSorter.getCompareeFunction()));
  }
}
