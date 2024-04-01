import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category } from '../model/category.model';
import { Page } from '../model/response.model';
import { errorHandle } from './service-support';

@Injectable()
export class CategoryQueryService {
  http = inject(HttpClient);

  resourceName: string = "categories";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  
  get(id: string): Observable<Category> {
    return this.http.request<Category>("GET",
      this.url + '/' + id,
    ).pipe(retry(1), catchError(errorHandle));
  }

  getAll(): Observable<Page<Category[]>> {
    return this.http.request<Page<Category[]>>("GET",
      this.url,
    ).pipe(retry(1), catchError(errorHandle));
  }
}
