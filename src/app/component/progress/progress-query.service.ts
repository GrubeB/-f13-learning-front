import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject, filter, first, map, mergeMap, throwError } from 'rxjs';
import { retry, catchError, take } from 'rxjs/operators';
import { Page } from '../../shared/model/response.model';
import { errorHandle } from '../../shared/service/service-support';
import { AuthenticationService } from '../../auth/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../shared/service/event-bus.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Progress, ProgressType } from './progress.model';
import { DomainObjectType } from '../voting/vote.model';
import { AbstractProgressQueryService } from './abstract-progress.service';
import { ProgressSetEvent } from './progress-module.event';

// TODO servis should make only one call when starting application,
// and then should keep and update his state by yourself 
@Injectable()
export class ProgressQueryService implements AbstractProgressQueryService {
  logger = inject(NGXLogger);
  http: HttpClient = inject(HttpClient);
  authenticationService = inject(AuthenticationService);
  eventBus = inject(EventBusService);

  resourceName: string = "progresses";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  private currentUserId!: string;
  public cache$ = new ReplaySubject<Progress[]>(1);

  private setProgress(userId: string, type: ProgressType, domainObject: string, domainObjectType: DomainObjectType) {
    this.logger.info(ProgressQueryService.name, " setProgress()");
    this.cache$.pipe(take(1)).subscribe({
      next: data => {
        let existingElement = data.find(e => e.domainObject === domainObject && e.domainObjectType.toString() === DomainObjectType[domainObjectType]);
        if (existingElement != null) {
          existingElement.type = type;
          this.cache$.next(data);
        } else {
          let newElement = new Progress();
          newElement.userId = userId;
          newElement.type = ProgressType[type];
          newElement.domainObject = domainObject;
          newElement.domainObjectType = domainObjectType;
          data.push(newElement);
          this.cache$.next(data);
        }
      }
    });
  }

  constructor() {
    this.eventBus.listen(ProgressSetEvent.name, (event: ProgressSetEvent) => {
      this.setProgress(this.currentUserId, event.progressType, event.domainObject, event.domainObjectType);
    });

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

  private refreshData(): Observable<Page<Progress[]>> {
    this.logger.info(ProgressQueryService.name, "refreshData()");
    if (this.currentUserId == null) {
      return throwError(() => Error('userId jest null'));
    }
    return this.http.request<Page<Progress[]>>("GET",
      this.url,
      {
        params: new HttpParams().set('query', '"' + 'userId=' + this.currentUserId + '"')
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Progress[]> {
    return this.cache$;
  }
  getAllByDomainType(domainObjectType: DomainObjectType): Observable<Progress[]> {
    this.logger.info(ProgressQueryService.name, " getAllByDomainType()");
    return this.getAll().pipe(
      map(arr => arr.filter(e => e.domainObjectType.toString() == DomainObjectType[domainObjectType])),
    );
  }
  getByDomainObject(domainObjectType: DomainObjectType, domainObjectId: string): Observable<Progress | undefined> {
    this.logger.info(ProgressQueryService.name, " getByDomainObject()");
    return this.getAll().pipe(
      mergeMap(array => array),
      filter(element => element.domainObjectType.toString() == DomainObjectType[domainObjectType]),
      filter(element => element.domainObject === domainObjectId),
    );
  }
}
