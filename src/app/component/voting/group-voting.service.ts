import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { AbstractVotingService } from './abstract-voting.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../shared/service/event-bus.service';
import { GroupDisLikeRemvedEvent, GroupDislikedEvent, GroupLikeDislikRemovedEvent, GroupLikeRemvedEvent, GroupLikedEvent } from './voting-module.event';

@Injectable()
export class GroupVotingService extends AbstractVotingService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  resourceName: string = "groups";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;

  createLike(id: string): void {
    this.makeCreateLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(GroupVotingService.name, "User give like");
        this.eventBus.emit(GroupLikedEvent.name, new GroupLikedEvent(id));
      }
    });
  }

  deleteLike(id: string): void {
    this.makeDeleteLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(GroupVotingService.name, " User removed like");
        this.eventBus.emit(GroupLikeRemvedEvent.name, new GroupLikeRemvedEvent(id));
      }
    });
  }

  createDislike(id: string): void {
    this.makeCreateDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(GroupVotingService.name, " User give dislike");
        this.eventBus.emit(GroupDislikedEvent.name, new GroupDislikedEvent(id));
      }
    });
  }

  deleteDislike(id: string): void {
    this.makeDeleteDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(GroupVotingService.name, " User removed like");
        this.eventBus.emit(GroupDisLikeRemvedEvent.name, new GroupDisLikeRemvedEvent(id));
      }
    });
  }

  deleteLikeAndDislike(id: string): void {
    this.makeDeleteLikeAndDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(GroupVotingService.name, " User removed like/dislike");
        this.eventBus.emit(GroupLikeDislikRemovedEvent.name, new GroupLikeDislikRemovedEvent(id));
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
