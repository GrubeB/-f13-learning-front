import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { errorHandle } from '../../shared/service/service-support';
import { CreatePathCommand, Path, UpdatePathCommand } from './path.model';

@Injectable()
export class PathService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "paths";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  create(data: CreatePathCommand): Observable<Path> {
    return this.http.request<Path>("POST",
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

  update(data: UpdatePathCommand): Observable<HttpEvent<any>> {
    return this.http.request<any>("PUT",
      this.url + '/' + data.pathId,
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
