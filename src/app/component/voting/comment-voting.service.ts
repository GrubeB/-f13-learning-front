import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { AbstractVotingService } from './abstract-voting.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../shared/service/event-bus.service';
import { CommentDisLikeRemvedEvent, CommentDislikedEvent, CommentLikeDislikRemovedEvent, CommentLikeRemvedEvent, CommentLikedEvent } from './voting-module.event';

@Injectable()
export class CommentVotingService extends AbstractVotingService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  resourceName: string = "comments";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;

  createLike(id: string): void {
    this.makeCreateLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CommentVotingService.name, "User give like");
        this.eventBus.emit(CommentLikedEvent.name, new CommentLikedEvent(id));
      }
    });
  }

  deleteLike(id: string): void {
    this.makeDeleteLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CommentVotingService.name, " User removed like");
        this.eventBus.emit(CommentLikeRemvedEvent.name, new CommentLikeRemvedEvent(id));
      }
    });
  }

  createDislike(id: string): void {
    this.makeCreateDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CommentVotingService.name, " User give dislike");
        this.eventBus.emit(CommentDislikedEvent.name, new CommentDislikedEvent(id));
      }
    });
  }

  deleteDislike(id: string): void {
    this.makeDeleteDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CommentVotingService.name, " User removed like");
        this.eventBus.emit(CommentDisLikeRemvedEvent.name, new CommentDisLikeRemvedEvent(id));
      }
    });
  }

  deleteLikeAndDislike(id: string): void {
    this.makeDeleteLikeAndDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CommentVotingService.name, " User removed like/dislike");
        this.eventBus.emit(CommentLikeDislikRemovedEvent.name, new CommentLikeDislikRemovedEvent(id));
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
