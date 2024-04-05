import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reference } from './reference.model';

export abstract class ReferenceService {

  abstract create(topicId: string, data: Reference): Observable<Reference>;

  abstract update(data: Reference): Observable<HttpEvent<any>>;

  abstract delete(id: number): Observable<HttpEvent<any>>;
}
