import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { errorHandle } from '../../service/service-support';
import { VotingService } from './voting.service';

@Injectable()
export class CommentVotingService extends VotingService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "comments";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  createLike(id: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("POST",
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

  deleteLike(id: string, userId: string): Observable<HttpEvent<any>> {
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

  createDislike(id: string, userId: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("POST",
      this.url + "/" + id + "/dislikes/" + userId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  deleteDislike(id: string, userId: string): Observable<HttpEvent<any>> {
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
  deleteLikeAndDislike(id: string, userId: string): Observable<HttpEvent<any>> {
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
}
