import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { errorHandle } from './service-support';
import { Reference } from '../model/reference.model';

@Injectable()
export class ReferenceVotingService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "references";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  createLike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("POST",
      this.url + "/" + referenceId + "/likes",
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ referenceId: referenceId, userId: userId }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  deleteLike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url + "/" + referenceId + "/likes",
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ referenceId: referenceId, userId: userId }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  createDislike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("POST",
      this.url + "/" + referenceId + "/dislikes",
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ referenceId: referenceId, userId: userId }),
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
  deleteDislike(referenceId: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url + "/" + referenceId + "/dislikes",
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ referenceId: referenceId, userId: userId }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }
}
