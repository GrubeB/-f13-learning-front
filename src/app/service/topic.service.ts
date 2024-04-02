import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category } from '../model/category.model';
import { Page } from '../model/response.model';
import { Topic } from '../model/topic.model';
import { errorHandle } from './service-support';

@Injectable()
export class TopicService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "topics";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  create(data: Topic): Observable<Topic> {
    return this.http.request<Topic>("POST",
      this.url,
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

  update(data: Topic): Observable<HttpEvent<any>> {
    return this.http.request<any>("PUT",
      this.url + '/' + data.id,
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

  delete(id: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }
}
