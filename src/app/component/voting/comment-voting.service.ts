import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, switchMap } from 'rxjs/operators';
import { errorHandle } from '../../service/service-support';
import { AbstractVotingService } from './abstract-voting.service';
import { AuthenticationService } from '../../auth/authentication.service';

@Injectable()
export class CommentVotingService extends AbstractVotingService {
  http: HttpClient = inject(HttpClient);
  authenticationService = inject(AuthenticationService);

  resourceName: string = "comments";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

 
  createLike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService.userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http.request<any>("POST",
          this.url + "/" + id + "/likes/" + userId,
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

  deleteLike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService.userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http.request<any>("DELETE",
          this.url + "/" + id + "/likes/" + userId,
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

  createDislike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService.userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http.request<any>("POST",
          this.url + "/" + id + "/dislikes/" + userId,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
          }
        ).pipe(retry(1), catchError(errorHandle));
      }
    ));
  }

  deleteDislike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService.userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http.request<any>("DELETE",
          this.url + "/" + id + "/dislikes/" + userId,
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
  
  deleteLikeAndDislike(id: string): Observable<HttpEvent<any>> {
    return this.authenticationService.userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http.request<any>("DELETE",
          this.url + "/" + id + "/likes-dislikes/" + userId,
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
