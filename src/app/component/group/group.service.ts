import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CreateGroupCommand, Group, UpdateGroupCommand } from './group.model';
import { errorHandle } from '../../shared/service/service-support';

@Injectable()
export class GroupService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "groups";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  create(data: CreateGroupCommand): Observable<Group> {
    return this.http.request<Group>("POST",
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

  update(data: UpdateGroupCommand): Observable<HttpEvent<any>> {
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
