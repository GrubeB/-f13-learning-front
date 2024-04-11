import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, concat, filter, first, flatMap, map, mergeMap, of, throwError } from 'rxjs';
import { retry, catchError, switchMap, take, defaultIfEmpty, toArray, tap } from 'rxjs/operators';
import { Page } from '../../model/response.model';
import { errorHandle } from '../../service/service-support';
import { AbstractVotingQueryService } from './abstract-voting.service';
import { DomainObjectType, Vote, VoteType } from './vote.model';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../service/event-bus.service';
import { CategoryDisLikeRemvedEvent, CategoryDislikedEvent, CategoryLikeDislikRemovedEvent, CategoryLikeRemvedEvent, CategoryLikedEvent, CommentDisLikeRemvedEvent, CommentDislikedEvent, CommentLikeDislikRemovedEvent, CommentLikeRemvedEvent, CommentLikedEvent, GroupDisLikeRemvedEvent, GroupDislikedEvent, GroupLikeDislikRemovedEvent, GroupLikeRemvedEvent, GroupLikedEvent, ReferenceDisLikeRemvedEvent, ReferenceDislikedEvent, ReferenceLikeDislikRemovedEvent, ReferenceLikeRemvedEvent, ReferenceLikedEvent, TopicDisLikeRemvedEvent, TopicDislikedEvent, TopicLikeDislikRemovedEvent, TopicLikeRemvedEvent, TopicLikedEvent } from './voting-module.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// TODO servis should make only one call when starting application,
// and then should keep and update his state by yourself 
@Injectable()
export class VotingQueryService implements AbstractVotingQueryService {
  logger = inject(NGXLogger);
  http: HttpClient = inject(HttpClient);
  authenticationService = inject(AuthenticationService);
  eventBus = inject(EventBusService);

  resourceName: string = "votes";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  private currentUserId!: string;
  public cache$ = new ReplaySubject<Vote[]>(1);

  private addVote(userId: string, type: VoteType, domainObject: string, domainObjectType: DomainObjectType) {
    this.logger.info(VotingQueryService.name, " addVote()");
    this.cache$.pipe(take(1)).subscribe({
      next: data => {
        let existingElement = data.find(e => e.domainObject === domainObject && e.domainObjectType.toString() === DomainObjectType[domainObjectType]);
        if (existingElement != null) {
          existingElement.type = type;
          this.cache$.next(data);
        } else {
          let newVote = new Vote();
          newVote.userId = userId;
          newVote.type = VoteType[type];
          newVote.domainObject = domainObject;
          newVote.domainObjectType = domainObjectType;
          data.push(newVote);
          this.cache$.next(data);
        }
      }
    });
  }
  private removeVote(userId: string, domainObject: string, domainObjectType: DomainObjectType) {
    this.logger.info(VotingQueryService.name, " removeVote()");
    this.cache$.pipe(take(1)).subscribe({
      next: data => {
        let existingElement = data.find(e => e.domainObject === domainObject && e.domainObjectType.toString() === DomainObjectType[domainObjectType]);
        if (existingElement != null) {
          existingElement.type = VoteType.NULL;
          this.cache$.next(data);
        }
      }
    });
  }

  constructor() {
    this.eventBus.listen(ReferenceLikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.LIKE, e.id, DomainObjectType.REFERENCE); });
    this.eventBus.listen(ReferenceLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.REFERENCE); });
    this.eventBus.listen(ReferenceDislikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.DISLIKE, e.id, DomainObjectType.REFERENCE); });
    this.eventBus.listen(ReferenceDisLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.REFERENCE); });
    this.eventBus.listen(ReferenceLikeDislikRemovedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.REFERENCE); });

    this.eventBus.listen(CommentLikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.LIKE, e.id, DomainObjectType.COMMENT); });
    this.eventBus.listen(CommentLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.COMMENT); });
    this.eventBus.listen(CommentDislikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.DISLIKE, e.id, DomainObjectType.COMMENT); });
    this.eventBus.listen(CommentDisLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.COMMENT); });
    this.eventBus.listen(CommentLikeDislikRemovedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.COMMENT); });

    this.eventBus.listen(TopicLikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.LIKE, e.id, DomainObjectType.TOPIC); });
    this.eventBus.listen(TopicLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.TOPIC); });
    this.eventBus.listen(TopicDislikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.DISLIKE, e.id, DomainObjectType.TOPIC); });
    this.eventBus.listen(TopicDisLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.TOPIC); });
    this.eventBus.listen(TopicLikeDislikRemovedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.TOPIC); });

    this.eventBus.listen(CategoryLikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.LIKE, e.id, DomainObjectType.CATEGORY); });
    this.eventBus.listen(CategoryLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.CATEGORY); });
    this.eventBus.listen(CategoryDislikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.DISLIKE, e.id, DomainObjectType.CATEGORY); });
    this.eventBus.listen(CategoryDisLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.CATEGORY); });
    this.eventBus.listen(CategoryLikeDislikRemovedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.CATEGORY); });

    this.eventBus.listen(GroupLikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.LIKE, e.id, DomainObjectType.GROUP); });
    this.eventBus.listen(GroupLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.GROUP); });
    this.eventBus.listen(GroupDislikedEvent.name, (e) => { this.addVote(this.currentUserId, VoteType.DISLIKE, e.id, DomainObjectType.GROUP); });
    this.eventBus.listen(GroupDisLikeRemvedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.GROUP); });
    this.eventBus.listen(GroupLikeDislikRemovedEvent.name, (e) => { this.removeVote(this.currentUserId, e.id, DomainObjectType.GROUP); });
    
    this.authenticationService.userId$().pipe(takeUntilDestroyed()).subscribe({
      next: data => {
        if (data != null) {
          this.currentUserId = data;
          this.refreshData().pipe(first()).subscribe({
            next: data => {
              this.cache$.next(data.content);
            }
          });
        } else {
          this.currentUserId = "";
          this.cache$.next([]);
        }
      }
    });
  }

  private refreshData(): Observable<Page<Vote[]>> {
    this.logger.info(VotingQueryService.name, "refreshData()");
    if (this.currentUserId == null) {
      return throwError(() => Error('userId jest null'));
    }
    return this.http.request<Page<Vote[]>>("GET",
      this.url,
      {
        params: new HttpParams().set('query', '"' + 'userId=' + this.currentUserId + '"')
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  getAllByUser(): Observable<Vote[]> {
    return this.cache$;
  }
  getByDomainType(domainObjectType: DomainObjectType): Observable<Vote[]> {
    this.logger.info(VotingQueryService.name, " getByDomainType()");
    return this.getAllByUser().pipe(
      map(arr => arr.filter(e => e.domainObjectType.toString() == DomainObjectType[domainObjectType])),
    );
  }
  get(domainObjectType: DomainObjectType, domainObjectId: string): Observable<Vote | undefined> {
    this.logger.info(VotingQueryService.name, " get()");
    return this.getAllByUser().pipe(
      mergeMap(array => array),
      filter(element => element.domainObjectType.toString() == DomainObjectType[domainObjectType]),
      filter(element => element.domainObject === domainObjectId),
    );
  }
}
