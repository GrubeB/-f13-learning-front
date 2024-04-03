import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category, CreateCategoryCommand, UpdateCategoryCommand } from './category.model';
import { Page } from '../../model/response.model';
import { errorHandle } from '../../service/service-support';

@Injectable()
export class CategoryService {
  http = inject(HttpClient);

  resourceName: string = "categories";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  create(data: CreateCategoryCommand): Observable<Category> {
    return this.http.request<Category>("POST",
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

  update(data: UpdateCategoryCommand): Observable<HttpEvent<any>> {
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
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: "json",
      }
    ).pipe(catchError(errorHandle));
  }
}
