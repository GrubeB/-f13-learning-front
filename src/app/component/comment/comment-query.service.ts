import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Page } from '../../shared/model/response.model';
import { errorHandle } from '../../shared/service/service-support';
import { Comment } from './comment.model';

@Injectable()
export class CommentQueryService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "comments";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

 get(id: string): Observable<Comment> {
    return this.http.request<Comment>("GET",
      this.url + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Page<Comment[]>> {
    return this.http.request<Page<Comment[]>>("GET",
      this.url,
    ).pipe(retry(1), catchError(errorHandle));
  }
}
