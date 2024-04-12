import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Page } from '../../shared/model/response.model';
import { errorHandle } from '../../shared/service/service-support';
import { User } from './user.model';

@Injectable()
export class UserQueryService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "users";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9007" + this.resourcePath;

 get(id: string): Observable<User> {
    return this.http.request<User>("GET",
      this.url + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Page<User[]>> {
    return this.http.request<Page<User[]>>("GET",
      this.url,
    ).pipe(retry(1), catchError(errorHandle));
  }
}
