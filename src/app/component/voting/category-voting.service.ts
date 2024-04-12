import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, switchMap, first } from 'rxjs/operators';
import { errorHandle } from '../../shared/service/service-support';
import { AbstractVotingService } from './abstract-voting.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { CategoryDisLikeRemvedEvent, CategoryDislikedEvent, CategoryLikeDislikRemovedEvent, CategoryLikeRemvedEvent, CategoryLikedEvent } from './voting-module.event';
import { EventBusService } from '../../shared/service/event-bus.service';

@Injectable()
export class CategoryVotingService extends AbstractVotingService {
  _http: HttpClient = inject(HttpClient);
  _authenticationService = inject(AuthenticationService);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  resourceName: string = "categories";
  resourcePath: string = "/api/v1/" + this.resourceName;
  _url: string = "http://localhost:9006" + this.resourcePath;

  createLike(id: string): void {
    this.makeCreateLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CategoryVotingService.name, "User give like");
        this.eventBus.emit(CategoryLikedEvent.name, new CategoryLikedEvent(id));
      }
    });
  }

  deleteLike(id: string): void {
    this.makeDeleteLike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CategoryVotingService.name, " User removed like");
        this.eventBus.emit(CategoryLikeRemvedEvent.name, new CategoryLikeRemvedEvent(id));
      }
    });
  }

  createDislike(id: string): void {
    this.makeCreateDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CategoryVotingService.name, " User give dislike");
        this.eventBus.emit(CategoryDislikedEvent.name, new CategoryDislikedEvent(id));
      }
    });
  }

  deleteDislike(id: string): void {
    this.makeDeleteDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CategoryVotingService.name, " User removed like");
        this.eventBus.emit(CategoryDisLikeRemvedEvent.name, new CategoryDisLikeRemvedEvent(id));
      }
    });
  }

  deleteLikeAndDislike(id: string): void {
    this.makeDeleteLikeAndDislike(id).pipe(first()).subscribe({
      next: res => {
        this.logger.info(CategoryVotingService.name, " User removed like/dislike");
        this.eventBus.emit(CategoryLikeDislikRemovedEvent.name, new CategoryLikeDislikRemovedEvent(id));
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
