import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, first, retry, switchMap, take, throwError } from 'rxjs';
import { DomainObjectType, Vote } from './vote.model';
import { AuthenticationService } from '../../auth/authentication.service';
import { errorHandle } from '../../shared/service/service-support';
import { EventBusService } from '../../shared/service/event-bus.service';
import { DisLikeRemvedEvent, DislikedEvent, LikeDislikRemovedEvent, LikeRemvedEvent, LikedEvent } from './voting-module.event';

export abstract class AbstractVotingQueryService {
  abstract getAll(): Observable<Vote[]>;
  abstract getAllByDomainType(domainObjectType: DomainObjectType): Observable<Vote[]>
  abstract getByDomainObject(domainObjectId: string, domainObjectType: DomainObjectType): Observable<Vote | undefined>;
}

export abstract class AbstractVotingService {
  abstract authenticationService(): AuthenticationService;
  abstract eventBus(): EventBusService;
  abstract http(): HttpClient;
  abstract url(): string;
  abstract domainObjectType(): DomainObjectType;

  makeCreateLikeRequest(domainObject: string, userId: string): Observable<HttpEvent<any>> {
    return this.http().request<any>("POST",
      this.url() + "/" + domainObject + "/likes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle))
  }

  createLike(domainObject: string): void {
    this.authenticationService().userId$().pipe(take(1)).subscribe({
      next: userId => {
        if (userId == null) {
          throwError(() => Error('userId is null'));
          return;
        }
        this.makeCreateLikeRequest(domainObject, userId).pipe(first()).subscribe({
          next: res => {
            this.eventBus().emit(LikedEvent.name, new LikedEvent(userId, domainObject, this.domainObjectType()));
          }
        });
      }
    });
  }

  makeRemoveLikeRequest(domainObject: string, userId: string): Observable<HttpEvent<any>> {
    return this.http().request<any>("DELETE",
      this.url() + "/" + domainObject + "/likes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  removeLike(domainObject: string): void {
    this.authenticationService().userId$().pipe(take(1)).subscribe({
      next: userId => {
        if (userId == null) {
          throwError(() => Error('userId is null'));
          return;
        }
        this.makeRemoveLikeRequest(domainObject, userId).pipe(first()).subscribe({
          next: res => {
            this.eventBus().emit(LikeRemvedEvent.name, new LikeRemvedEvent(userId, domainObject, this.domainObjectType()));
          }
        });
      }
    });
  }

  makeCreateDislikeRequest(domainObject: string, userId: string): Observable<HttpEvent<any>> {
    return this.http().request<any>("POST",
      this.url() + "/" + domainObject + "/dislikes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  createDislike(domainObject: string): void {
    this.authenticationService().userId$().pipe(take(1)).subscribe({
      next: userId => {
        if (userId == null) {
          throwError(() => Error('userId is null'));
          return;
        }
        this.makeCreateDislikeRequest(domainObject, userId).pipe(first()).subscribe({
          next: res => {
            this.eventBus().emit(DislikedEvent.name, new DislikedEvent(userId, domainObject, this.domainObjectType()));
          }
        });
      }
    });
  }


  makeRemoveDislikeRequest(domainObject: string, userId: string): Observable<HttpEvent<any>> {
    return this.http().request<any>("DELETE",
      this.url() + "/" + domainObject + "/dislikes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  removeDislike(domainObject: string): void {
    this.authenticationService().userId$().pipe(take(1)).subscribe({
      next: userId => {
        if (userId == null) {
          throwError(() => Error('userId is null'));
          return;
        }
        this.makeRemoveDislikeRequest(domainObject, userId).pipe(first()).subscribe({
          next: res => {
            this.eventBus().emit(DisLikeRemvedEvent.name, new DisLikeRemvedEvent(userId, domainObject, this.domainObjectType()));
          }
        });
      }
    });
  }

  makeRemoveLikeAndDislikeRequest(domainObject: string, userId: string): Observable<HttpEvent<any>> {
    return this.http().request<any>("DELETE",
      this.url() + "/" + domainObject + "/likes-dislikes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  removeLikeAndDislike(domainObject: string): void {
    this.authenticationService().userId$().pipe(take(1)).subscribe({
      next: userId => {
        if (userId == null) {
          throwError(() => Error('userId is null'));
          return;
        }
        this.makeRemoveLikeAndDislikeRequest(domainObject, userId).pipe(first()).subscribe({
          next: res => {
            this.eventBus().emit(LikeDislikRemovedEvent.name, new LikeDislikRemovedEvent(userId, domainObject, this.domainObjectType()));
          }
        });
      }
    });
  }
}