import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { errorHandle } from '../../shared/service/service-support';
import { CreateReferenceCommand, Reference, UpdateReferenceCommand } from './reference.model';
import { AbstractReferenceService } from './abstract-reference.service';

@Injectable()
export class TopicReferenceService extends AbstractReferenceService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "references";
  resourcePath: string = "/api/v1/groups/:modelId/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  create(modelId: string, data: CreateReferenceCommand): Observable<Reference> {
    return this.http.request<Reference>("POST",
      this.url.replace(":modelId", modelId),
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

  update(modelId: string, id: string, data: UpdateReferenceCommand): Observable<HttpEvent<any>> {
    return this.http.request<any>("PUT",
      this.url.replace(":modelId", modelId) + '/' + id,
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

  delete(modelId: string, id: string): Observable<HttpEvent<any>> {
    return this.http.request<any>("DELETE",
      this.url.replace(":modelId", modelId) + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }
}
