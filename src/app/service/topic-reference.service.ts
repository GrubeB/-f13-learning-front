import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { errorHandle } from './service-support';
import { Reference } from '../model/reference.model';

@Injectable()
export class TopicReferenceService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "references";
  resourcePath: string = "/api/v1/topics/:topicId/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  create(topicId: string, data: Reference): Observable<Reference> {
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

  update(data: Reference): Observable<HttpEvent<any>> {
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

  delete(id: number): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }

}
