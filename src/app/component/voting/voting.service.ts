import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class VotingService {

  abstract createLike(referenceId: string, userId: string): Observable<HttpEvent<any>>;

  abstract deleteLike(referenceId: string, userId: string): Observable<HttpEvent<any>>;

  abstract createDislike(referenceId: string, userId: string): Observable<HttpEvent<any>>;

  abstract deleteDislike(referenceId: string, userId: string): Observable<HttpEvent<any>>;

  abstract deleteLikeAndDislike(referenceId: string, userId: string): Observable<HttpEvent<any>>;

}