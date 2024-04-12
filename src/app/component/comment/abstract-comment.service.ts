import { HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reference } from '../reference/reference.model';
import { CreateCommentCommand, UpdateCommentCommand } from './comment.model';

export abstract class AbstractCommentService {

  abstract create(modelId: string, data: CreateCommentCommand): Observable<Reference>;

  abstract createRepley(modelId: string, parentCommentId: string, data: CreateCommentCommand): Observable<Reference>;

  abstract update(modelId: string, data: UpdateCommentCommand): Observable<HttpEvent<any>>;

  abstract delete(modelId: string, id: string): Observable<HttpEvent<any>>;
}
