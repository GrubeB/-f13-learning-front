import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, concat, filter, first, flatMap, map, mergeMap, of, throwError } from 'rxjs';
import { retry, catchError, switchMap, take, defaultIfEmpty, toArray, tap } from 'rxjs/operators';
import { Page } from '../../shared/model/response.model';
import { errorHandle } from '../../shared/service/service-support';
import { AbstractVotingQueryService } from './abstract-voting.service';
import { DomainObjectType, Vote, VoteType } from './vote.model';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../shared/service/event-bus.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DisLikeRemvedEvent, DislikedEvent, LikeDislikRemovedEvent, LikeRemvedEvent, LikedEvent } from './voting-module.event';

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
    this.eventBus.listen(LikedEvent.name, (event: LikedEvent) => { this.addVote(event.userId, VoteType.LIKE, event.domainObject, event.domainObjectType); });
    this.eventBus.listen(LikeRemvedEvent.name, (event: LikeRemvedEvent) => { this.removeVote(event.userId, event.domainObject, event.domainObjectType); });
    this.eventBus.listen(DislikedEvent.name, (event: DislikedEvent) => { this.addVote(event.userId, VoteType.DISLIKE, event.domainObject, event.domainObjectType); });
    this.eventBus.listen(DisLikeRemvedEvent.name, (event: DisLikeRemvedEvent) => { this.removeVote(event.userId, event.domainObject, event.domainObjectType); });
    this.eventBus.listen(LikeDislikRemovedEvent.name, (event: LikeDislikRemovedEvent) => { this.removeVote(event.userId, event.domainObject, event.domainObjectType); });

    this.authenticationService.userId$().pipe(takeUntilDestroyed()).subscribe({
      next: data => {
        if (data != null) {
          this.refreshData(data).pipe(first()).subscribe({
            next: data => {
              this.cache$.next(data.content);
            }
          });
        } else {
          this.cache$.next([]);
        }
      }
    });
  }

  private refreshData(userId: string): Observable<Page<Vote[]>> {
    this.logger.info(VotingQueryService.name, "refreshData()");
    if (userId == null) {
      return throwError(() => Error('userId jest null'));
    }
    return this.http.request<Page<Vote[]>>("GET",
      this.url,
      {
        params: new HttpParams().set('query', '"' + 'userId=' + userId + '"')
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Vote[]> {
    return this.cache$;
  }
  getAllByDomainType(domainObjectType: DomainObjectType): Observable<Vote[]> {
    this.logger.info(VotingQueryService.name, " getByDomainType()");
    return this.getAll().pipe(
      map(arr => arr.filter(e => e.domainObjectType.toString() == DomainObjectType[domainObjectType])),
    );
  }
  getByDomainObject(domainObjectType: DomainObjectType, domainObjectId: string): Observable<Vote | undefined> {
    this.logger.info(VotingQueryService.name, " get()");
    return this.getAll().pipe(
      mergeMap(array => array),
      filter(element => element.domainObjectType.toString() == DomainObjectType[domainObjectType]),
      filter(element => element.domainObject === domainObjectId),
    );
  }
}
