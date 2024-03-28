import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category } from '../model/category.model';
import { Page } from '../model/response.model';
import { Topic } from '../model/topic.model';
import { errorHandle } from './support';
@Injectable()
export class TopicService {
  resourceName: string = "topics";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }
  // GET
  get(id: string): Observable<Topic> {
    return this.http
      .get<Topic>(this.url + '/' + id)
      .pipe(retry(1), catchError(errorHandle));
  }

  // GET
  getAll(): Observable<Page<Topic[]>> {
    return this.http
      .get<Page<Topic[]>>(this.url)
      .pipe(retry(1), catchError(errorHandle));
  }

  // POST
  create(data: Topic): Observable<Topic> {
    return this.http
      .post<Topic>(
        this.url,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(catchError(errorHandle));
  }

  // DELETE
  delete(id: number) {
    return this.http
      .delete<void>(this.url + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(errorHandle));
  }
}
