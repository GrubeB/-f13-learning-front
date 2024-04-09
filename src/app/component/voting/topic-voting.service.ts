import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { AbstractVotingService } from './abstract-voting.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../service/event-bus.service';
import { TopicDisLikeRemvedEvent, TopicDislikedEvent, TopicLikeDislikRemovedEvent, TopicLikeRemvedEvent, TopicLikedEvent } from './voting-module.event';

@Injectable()
export class TopicVotingService extends AbstractVotingService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  resourceName: string = "topics";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;

  createLike(id: string): void {
    this.makeCreateLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(TopicVotingService.name, "User give like");
        this.eventBus.emit(TopicLikedEvent.name, new TopicLikedEvent(id));
      }
    });
  }

  deleteLike(id: string): void {
    this.makeDeleteLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(TopicVotingService.name, " User removed like");
        this.eventBus.emit(TopicLikeRemvedEvent.name, new TopicLikeRemvedEvent(id));
      }
    });
  }

  createDislike(id: string): void {
    this.makeCreateDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(TopicVotingService.name, " User give dislike");
        this.eventBus.emit(TopicDislikedEvent.name, new TopicDislikedEvent(id));
      }
    });
  }

  deleteDislike(id: string): void {
    this.makeDeleteDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(TopicVotingService.name, " User removed like");
        this.eventBus.emit(TopicDisLikeRemvedEvent.name, new TopicDisLikeRemvedEvent(id));
      }
    });
  }

  deleteLikeAndDislike(id: string): void {
    this.makeDeleteLikeAndDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(TopicVotingService.name, " User removed like/dislike");
        this.eventBus.emit(TopicLikeDislikRemovedEvent.name, new TopicLikeDislikRemovedEvent(id));
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
