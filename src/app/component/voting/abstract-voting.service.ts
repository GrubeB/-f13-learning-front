import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, switchMap, throwError } from 'rxjs';
import { DomainObjectType, Vote } from './vote.model';
import { AuthenticationService } from '../../auth/authentication.service';
import { errorHandle } from '../../shared/service/service-support';

export abstract class AbstractVotingQueryService {
  abstract getAllByUser(): Observable<Vote[]>;
  abstract get(domainObjectId: string, domainObjectType: DomainObjectType): Observable<Vote | undefined>;
}

export abstract class AbstractVotingService {

  abstract createLike(referenceId: string): void;

  abstract deleteLike(referenceId: string): void;

  abstract createDislike(referenceId: string): void;

  abstract deleteDislike(referenceId: string): void;

  abstract deleteLikeAndDislike(referenceId: string): void;

  abstract authenticationService(): AuthenticationService;
  abstract http(): HttpClient;
  abstract url(): string;

  makeCreateLike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService().userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http().request<any>("POST",
          this.url() + "/" + id + "/likes/" + userId,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            observe: 'body',
            responseType: "json",
          }
        ).pipe(retry(1), catchError(errorHandle))
      }
    ));
  }

  makeDeleteLike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService().userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http().request<any>("DELETE",
          this.url() + "/" + id + "/likes/" + userId,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            observe: 'body',
            responseType: "json",
          }
        ).pipe(retry(1), catchError(errorHandle));
      }
    ));
  }

  makeCreateDislike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService().userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http().request<any>("POST",
          this.url() + "/" + id + "/dislikes/" + userId,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
          }
        ).pipe(retry(1), catchError(errorHandle));
      }
    ));
  }

  makeDeleteDislike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService().userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http().request<any>("DELETE",
          this.url() + "/" + id + "/dislikes/" + userId,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            observe: 'body',
            responseType: "json",
          }
        ).pipe(retry(1), catchError(errorHandle));
      }
    ));
  }
  
  makeDeleteLikeAndDislike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService().userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http().request<any>("DELETE",
          this.url() + "/" + id + "/likes-dislikes/" + userId,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            observe: 'body',
            responseType: "json",
          }
        ).pipe(retry(1), catchError(errorHandle));
      }
    ));
  }
}