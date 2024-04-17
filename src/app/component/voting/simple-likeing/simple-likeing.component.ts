import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { DomainObjectType, Vote } from '../vote.model';
import { CommonModule } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { VotingQueryService } from '../voting-query.service';
import { AbstractVotingService } from '../abstract-voting.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'simple-likeing',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './simple-likeing.component.html',
})
export class SimpleLikingComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  votingQueryService = inject(VotingQueryService);
  @Input() votingService!: AbstractVotingService;
  @Input() modelId!: string;
  _domainObjectType!: DomainObjectType;
  @Input() set domainObjectType(string: string) {
    this._domainObjectType = DomainObjectType[string as keyof typeof DomainObjectType];
  }
  vote?: Vote;

  ngOnInit(): void {
    this.getVote();
  }
  
  getVote() {
    this.logger.debug(SimpleLikingComponent.name, " getVote()");
    this.votingQueryService.getByDomainObject(this._domainObjectType, this.modelId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: vote => {
        this.vote = vote;
      },
    });
  }

  like() {
    this.logger.debug(SimpleLikingComponent.name, " like()");
    this.votingService.createLike(this.modelId)
  }
  removeLike() {
    this.logger.debug(SimpleLikingComponent.name, " removeLike()");
    this.votingService.removeLike(this.modelId)
  }
}
