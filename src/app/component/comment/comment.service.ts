import { HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reference } from '../reference/reference.model';
import { CreateCommentCommand, UpdateCommentCommand } from './category.model';

export abstract class CommentService {

  abstract create(topicId: string, data: CreateCommentCommand): Observable<Reference>;

  abstract createRepley(topicId: string, parentCommentId: string, data: CreateCommentCommand): Observable<Reference>;

  abstract update(topicId: string, data: UpdateCommentCommand): Observable<HttpEvent<any>>;

  abstract delete(topicId: string, id: string): Observable<HttpEvent<any>>;
}
