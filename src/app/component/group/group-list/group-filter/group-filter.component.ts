import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { Group } from '../../group.model';
import { Filter, Operator } from '../../../../shared/filter/filter.model';
import { DomainObjectType, Vote, VoteType } from '../../../voting/vote.model';
import { Direction, Sort} from '../../../../shared/filter/sort.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupFilterChangedEvent } from '../../group-module.event';

@Component({
  selector: 'group-filter',
  standalone: true,
  imports: [],
  templateUrl: './group-filter.component.html',
})
export class GroupFilterComponent implements OnChanges, OnInit {
  destroyRef = inject(DestroyRef);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  votingQueryService = inject(VotingQueryService);

  @Input() items!: Group[];
  @Output() outputItmes = new EventEmitter<Group[]>();

  filters: (() => Filter<Group>)[] = [
    () => Filter.customOf((e) => true),
    () => Filter.of('categories.id', Operator.IN, this.allVotes?.filter(v => v.type == VoteType.LIKE).map(v => v.domainObject)),
  ];
  sorters: (() => Sort<Group>)[] = [
    () => Sort.customOf((e: Group) => e.voting.likesNumber - e.voting.dislikesNumber, Direction.DESC),
    () => Sort.of('createdDate', Direction.DESC),
  ];
  activeFilter: Filter<Group> = this.filters[0]();
  activeSorter: Sort<Group> = this.sorters[0]();

  allVotes?: Vote[];

  ngOnInit(): void {
    this.getVotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshItems();
  }

  changeSorter(event: any) {
    this.logger.debug(GroupFilterComponent.name, "changeSorter()");
    this.activeSorter = this.sorters[event.target.value]();
    this.refreshItems();
  }

  changeFilter(event: any) {
    this.logger.debug(GroupFilterComponent.name, "changeFilter()");
    this.activeFilter = this.filters[event.target.value]();
    this.refreshItems();
    this.eventBus.emit(GroupFilterChangedEvent.name, new GroupFilterChangedEvent(this.activeFilter));
  }

  refreshItems() {
    this.logger.debug(GroupFilterComponent.name, "refreshItems()");
    this.outputItmes.emit(this.items.filter(this.activeFilter.getPredicateFunction())?.sort(this.activeSorter.getCompareeFunction()));
  }

  // VOTING
  getVotes() {
    this.logger.debug(GroupFilterComponent.name, "getVotes()");
    this.votingQueryService.getByDomainType(DomainObjectType.CATEGORY).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.allVotes = data;
      },
    });
  }
}
