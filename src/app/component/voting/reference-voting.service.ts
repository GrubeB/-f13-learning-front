import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { AbstractVotingService } from './abstract-voting.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../service/event-bus.service';
import { ReferenceDisLikeRemvedEvent, ReferenceDislikedEvent, ReferenceLikeDislikRemovedEvent, ReferenceLikeRemvedEvent, ReferenceLikedEvent } from './voting-module.event';

@Injectable()
export class ReferenceVotingService extends AbstractVotingService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  resourceName: string = "references";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;

  createLike(id: string): void {
    this.makeCreateLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(ReferenceVotingService.name, "User give like");
        this.eventBus.emit(ReferenceLikedEvent.name, new ReferenceLikedEvent(id));
      }
    });
  }

  deleteLike(id: string): void {
    this.makeDeleteLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(ReferenceVotingService.name, " User removed like");
        this.eventBus.emit(ReferenceLikeRemvedEvent.name, new ReferenceLikeRemvedEvent(id));
      }
    });
  }

  createDislike(id: string): void {
    this.makeCreateDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(ReferenceVotingService.name, " User give dislike");
        this.eventBus.emit(ReferenceDislikedEvent.name, new ReferenceDislikedEvent(id));
      }
    });
  }

  deleteDislike(id: string): void {
    this.makeDeleteDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(ReferenceVotingService.name, " User removed like");
        this.eventBus.emit(ReferenceDisLikeRemvedEvent.name, new ReferenceDisLikeRemvedEvent(id));
      }
    });
  }

  deleteLikeAndDislike(id: string): void {
    this.makeDeleteLikeAndDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(ReferenceVotingService.name, " User removed like/dislike");
        this.eventBus.emit(ReferenceLikeDislikRemovedEvent.name, new ReferenceLikeDislikRemovedEvent(id));
      }
    });
  }
  authenticationService(): AuthenticationService {
    return this._authenticationService;
  }
  http(): HttpClient {
    return this._http;
  }
  url(): string {
    return this._url;
  }
}
