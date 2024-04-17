import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Page } from '../../shared/model/response.model';
import { errorHandle } from '../../shared/service/service-support';
import { Path } from './path.model';

@Injectable()
export class PathQueryService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "paths";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  get(id: string): Observable<Path> {
    return this.http.request<Path>("GET",
      this.url + '/' + id
    ).pipe(map(event => event),retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Page<Path[]>> {
    return this.http.request<Page<Path[]>>("GET",
      this.url
    ).pipe(retry(1), catchError(errorHandle));
  }
}
