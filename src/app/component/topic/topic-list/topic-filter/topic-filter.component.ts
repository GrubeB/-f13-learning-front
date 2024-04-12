import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { Topic } from '../../topic.model';
import { EventBusService } from '../../../../service/event-bus.service';
import { NGXLogger } from 'ngx-logger';
import { Direction, Sort } from '../../../../../shared/filter/sort.model';
import { Filter, Operator } from '../../../../../shared/filter/filter.model';
import { TopicFilterChangedEvent } from '../../topic-module.event';
import { VotingQueryService } from '../../../voting/voting-query.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomainObjectType, Vote, VoteType } from '../../../voting/vote.model';

@Component({
  selector: 'topic-filter',
  standalone: true,
  imports: [],
  templateUrl: './topic-filter.component.html',
})
export class TopicFilterComponent implements OnChanges, OnInit {
  destroyRef = inject(DestroyRef);
  eventBus = inject(EventBusService);
  logger = inject(NGXLogger);
  votingQueryService = inject(VotingQueryService);

  @Input() items!: Topic[];
  @Output() outputItmes = new EventEmitter<Topic[]>();

  filters: (() => Filter<Topic>)[] = [
    () => Filter.customOf((e) => true),
    () => Filter.of('categories.id', Operator.IN, this.allVotes?.filter(v => v.type == VoteType.LIKE).map(v => v.domainObject)),
  ];
  sorters: (() => Sort<Topic>)[] = [
    () => Sort.customOf((e: Topic) => e.voting.likesNumber - e.voting.dislikesNumber, Direction.DESC),
    () => Sort.of('createdDate', Direction.DESC),
  ];
  activeFilter: Filter<Topic> = this.filters[0]();
  activeSorter: Sort<Topic> = this.sorters[0]();

  allVotes?: Vote[];

  ngOnInit(): void {
    this.getVotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshItems();
  }

  changeSorter(event: any) {
    this.logger.debug(TopicFilterComponent.name, "changeSorter()");
    this.activeSorter = this.sorters[event.target.value]();
    this.refreshItems();
  }

  changeFilter(event: any) {
    this.logger.debug(TopicFilterComponent.name, "changeFilter()");
    this.activeFilter = this.filters[event.target.value]();
    this.refreshItems();
    this.eventBus.emit(TopicFilterChangedEvent.name, new TopicFilterChangedEvent(this.activeFilter));
  }

  refreshItems() {
    this.logger.debug(TopicFilterComponent.name, "refreshItems()");
    this.outputItmes.emit(this.items.filter(this.activeFilter.getPredicateFunction())?.sort(this.activeSorter.getCompareeFunction()));
  }

  // VOTING
  getVotes() {
    this.logger.debug(TopicFilterComponent.name, "getVotes()");
    this.votingQueryService.getByDomainType(DomainObjectType.CATEGORY).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.allVotes = data;
      },
    });
  }
}
