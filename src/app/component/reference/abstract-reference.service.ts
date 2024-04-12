import { HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateReferenceCommand, Reference, UpdateReferenceCommand } from '../reference/reference.model';

export abstract class AbstractReferenceService {
  abstract create(modelId: string, data: CreateReferenceCommand): Observable<Reference>;
  abstract update(modelId: string, id: string, data: UpdateReferenceCommand): Observable<HttpEvent<any>>;
  abstract delete(modelId: string, id: string): Observable<HttpEvent<any>>;
}
