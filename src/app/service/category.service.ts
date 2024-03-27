import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category } from '../model/category.model';
import { Page } from '../model/response.model';

@Injectable()
export class CategoryService {
  resourceName: string = "categories";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  // POST
  create(data: Category): Observable<Category> {
    return this.http
      .post<Category>(
        this.url,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandl));
  }
  // GET
  get(id: Category): Observable<Category> {
    return this.http
      .get<Category>(this.url + '/' + id)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // GET
  getAll(): Observable<Page<Category[]>> {
    return this.http
      .get<Page<Category[]>>(this.url)
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // DELETE
  delete(id: number) {
    return this.http
      .delete<Category>(this.url + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // Error handling
  errorHandl(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
