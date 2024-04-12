import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Group } from './group.model';
import { errorHandle } from '../../shared/service/service-support';
import { Page } from '../../shared/model/response.model';

@Injectable()
export class GroupQueryService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "groups";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  get(id: string): Observable<Group> {
    return this.http.request<Group>("GET",
      this.url + '/' + id
    ).pipe(map(event => event),retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Page<Group[]>> {
    return this.http.request<Page<Group[]>>("GET",
      this.url
    ).pipe(retry(1), catchError(errorHandle));
  }
}
