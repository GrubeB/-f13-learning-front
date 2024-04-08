import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vote } from './vote.model';
import { Page } from '../../model/response.model';

export abstract class AbstractVotingQueryService {
  abstract getAllByUser(): Observable<Page<Vote[]>> ;
}

export abstract class AbstractVotingService {

  abstract createLike(referenceId: string): Observable<HttpEvent<any>>;

  abstract deleteLike(referenceId: string): Observable<HttpEvent<any>>;

  abstract createDislike(referenceId: string): Observable<HttpEvent<any>>;

  abstract deleteDislike(referenceId: string): Observable<HttpEvent<any>>;

  abstract deleteLikeAndDislike(referenceId: string): Observable<HttpEvent<any>>;

}