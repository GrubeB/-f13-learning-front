import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Page } from '../model/response.model';
import { errorHandle } from './service-support';
import { Reference } from '../model/reference.model';
@Injectable()
export class ReferenceQueryService {
  http: HttpClient = inject(HttpClient);

  resourceName: string = "references";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

 get(id: string): Observable<Reference> {
    return this.http.request<Reference>("GET",
      this.url + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Page<Reference[]>> {
    return this.http.request<Page<Reference[]>>("GET",
      this.url,
    ).pipe(retry(1), catchError(errorHandle));
  }
}
