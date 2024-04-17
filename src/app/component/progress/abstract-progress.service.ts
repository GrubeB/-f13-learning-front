import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, first, retry, switchMap, take, tap, throwError } from 'rxjs';
import { AuthenticationService } from '../../auth/authentication.service';
import { errorHandle } from '../../shared/service/service-support';
import { Progress, ProgressType } from './progress.model';
import { DomainObjectType } from '../voting/vote.model';
import { EventBusService } from '../../shared/service/event-bus.service';
import { ProgressSetEvent } from './progress-module.event';

export abstract class AbstractProgressQueryService {
  abstract getAll(): Observable<Progress[]>;
  abstract getAllByDomainType(domainObjectType: DomainObjectType): Observable<Progress[]>
  abstract getByDomainObject(domainObjectId: string, domainObjectType: DomainObjectType): Observable<Progress | undefined>;
}

export abstract class AbstractProgressService {
  abstract authenticationService(): AuthenticationService;
  abstract eventBus(): EventBusService;
  abstract http(): HttpClient;
  abstract url(): string;
  abstract domainObjectType(): DomainObjectType;

  makeSetProgressRequest(modelId: string, userId: string, type: ProgressType): Observable<HttpEvent<any>> {
    return this.http().request<any>("PUT",
      this.url() + '/' + modelId + "/progresses/" + userId + "/types/" + type,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  
  setProgress(domainObject: string, type: ProgressType): void {
    this.authenticationService().userId$().pipe(take(1)).subscribe({
      next: userId => {
        if (userId == null) {
          throwError(() => Error('userId is null'));
          return;
        }
        this.makeSetProgressRequest(domainObject, userId, type).pipe(first()).subscribe({
          next: res => {
            this.eventBus().emit(ProgressSetEvent.name, new ProgressSetEvent(userId, type, domainObject, this.domainObjectType()));
          }
        });
      }
    });
  }
}