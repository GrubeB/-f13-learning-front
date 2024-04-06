import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, take } from 'rxjs/operators';
import { errorHandle } from '../../service/service-support';
import { Reference } from '../reference/reference.model';
import { CreateCommentCommand, UpdateCommentCommand } from './category.model';
import { CommentService } from './comment.service';
import { AuthenticationService } from '../../auth/authentication.service';

@Injectable()
export class TopicCommentService extends CommentService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "comments";
  resourcePath: string = "/api/v1/topics/:topicId/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  create(topicId: string, data: CreateCommentCommand): Observable<Reference> {
    return this.http.request<Reference>("POST",
      this.url.replace(":topicId", topicId),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(catchError(errorHandle));
  }
  createRepley(topicId: string, parentCommentId: string, data: CreateCommentCommand): Observable<Reference> {
    return this.http.request<Reference>("POST",
      this.url.replace(":topicId", topicId) + "/" + parentCommentId + "/comments",
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(catchError(errorHandle));
  }

  update(topicId: string, data: UpdateCommentCommand): Observable<HttpEvent<any>> {
    return this.http.request<any>("PUT",
      this.url.replace(":topicId", topicId) + '/' + data.commentId,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(retry(1), catchError(errorHandle));
  }

  delete(topicId: string, id: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
    this.url.replace(":topicId", topicId) + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }
}
