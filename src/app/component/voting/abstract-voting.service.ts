import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomainObjectType, Vote } from './vote.model';

export abstract class AbstractVotingQueryService {
  abstract getAllByUser(): Observable<Vote[]>;
  abstract get(domainObjectId: string, domainObjectType: DomainObjectType): Observable<Vote | undefined>;
}

export abstract class AbstractVotingService {

  abstract createLike(referenceId: string): Observable<HttpEvent<any>>;

  abstract deleteLike(referenceId: string): Observable<HttpEvent<any>>;

  abstract createDislike(referenceId: string): Observable<HttpEvent<any>>;

  abstract deleteDislike(referenceId: string): Observable<HttpEvent<any>>;

  abstract deleteLikeAndDislike(referenceId: string): Observable<HttpEvent<any>>;

}