import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, switchMap } from 'rxjs/operators';
import { Page } from '../../model/response.model';
import { errorHandle } from '../../service/service-support';
import { AbstractVotingQueryService } from './abstract-voting.service';
import { Vote } from './vote.model';
import { AuthenticationService } from '../../auth/authentication.service';

// TODO servis should make only one call when starting application,
// and then should keep and update his state by yourself 
@Injectable()
export class VotingQueryService implements AbstractVotingQueryService {
  http: HttpClient = inject(HttpClient);
  authenticationService = inject(AuthenticationService);

  resourceName: string = "votes";
  resourcePath: string = "/api/v1/" + this.resourceName;
  url: string = "http://localhost:9006" + this.resourcePath;

  getAllByUser(): Observable<Page<Vote[]>> {
    return this.authenticationService.userId$().pipe(switchMap(
      userId => {
        if (userId == null) {
          return throwError(() => Error('userId jest null'));
        }
        return this.http.request<Page<Vote[]>>("GET",
          this.url,
          {
            params: new HttpParams().set('query', '"' + 'userId=' + userId + '"')
          }
        ).pipe(retry(1), catchError(errorHandle));
      }
    ));
  }
}
