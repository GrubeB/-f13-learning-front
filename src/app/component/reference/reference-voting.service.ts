import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { errorHandle } from '../../service/service-support';
import { Reference } from './reference.model';

@Injectable()
export class ReferenceVotingService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "references";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  createLike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("POST",
      this.url + "/" + referenceId + "/likes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  deleteLike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url + "/" + referenceId + "/likes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  createDislike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("POST",
      this.url + "/" + referenceId + "/dislikes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  deleteDislike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url + "/" + referenceId + "/dislikes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  deleteLikeAndDislike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url + "/" + referenceId + "/likes-dislikes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
}
