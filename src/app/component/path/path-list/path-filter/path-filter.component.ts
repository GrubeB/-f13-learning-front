import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { EventBusService } from '../../../../shared/service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { Filter, Operator } from '../../../../shared/filter/filter.model';
import { DomainObjectType, Vote, VoteType } from '../../../voting/vote.model';
import { Direction, Sort} from '../../../../shared/filter/sort.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Path } from '../../path.model';
import { GroupFilterChangedEvent } from '../../../group/group-module.event';
import { PathFilterChangedEvent } from '../../path-module.event';

@Component({
  selector: 'path-filter',
  standalone: true,
  imports: [],
  templateUrl: './path-filter.component.html',
})
export class PathFilterComponent implements OnChanges, OnInit {
  destroyRef = inject(DestroyRef);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  votingQueryService = inject(VotingQueryService);

  @Input() items!: Path[];
  @Output() outputItmes = new EventEmitter<Path[]>();

  filters: (() => Filter<Path>)[] = [
    () => Filter.customOf((e) => true),
    () => Filter.of('categories.id', Operator.IN, this.allVotes?.filter(v => v.type == VoteType.LIKE).map(v => v.domainObject)),
  ];
  sorters: (() => Sort<Path>)[] = [
    () => Sort.customOf((e: Path) => (e.voting?.likesNumber ?? 0) - (e.voting?.dislikesNumber ?? 0), Direction.DESC),
    () => Sort.of('createdDate', Direction.DESC),
  ];
  activeFilter: Filter<Path> = this.filters[0]();
  activeSorter: Sort<Path> = this.sorters[0]();

  allVotes?: Vote[];

  ngOnInit(): void {
    this.getVotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshItems();
  }

  changeSorter(event: any) {
    this.logger.debug(PathFilterComponent.name, "changeSorter()");
    this.activeSorter = this.sorters[event.target.value]();
    this.refreshItems();
  }

  changeFilter(event: any) {
    this.logger.debug(PathFilterComponent.name, "changeFilter()");
    this.activeFilter = this.filters[event.target.value]();
    this.refreshItems();
    this.eventBus.emit(PathFilterChangedEvent.name, new PathFilterChangedEvent(this.activeFilter));
  }

  refreshItems() {
    this.logger.debug(PathFilterComponent.name, "refreshItems()");
    this.outputItmes.emit(this.items.filter(this.activeFilter.getPredicateFunction())?.sort(this.activeSorter.getCompareeFunction()));
  }

  // VOTING
  getVotes() {
    this.logger.debug(PathFilterComponent.name, "getVotes()");
    this.votingQueryService.getAllByDomainType(DomainObjectType.CATEGORY).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.allVotes = data;
      },
    });
  }
}
