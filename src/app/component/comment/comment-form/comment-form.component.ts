import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Comment, CreateCommentCommand, UpdateCommentCommand } from '../comment.model';
import { CommentCreatedEvent, CommentUpdatedEvent, CreateCommentEvent, CreateCommentReplayEvent, UpdateCommentEvent } from '../comment-module.event';
import { CommentQueryService } from '../comment-query.service';
import { first, take } from 'rxjs';
import { AbstractCommentService } from '../abstract-comment.service';
import { AuthenticationService } from '../../../auth/authentication.service';

@Component({
  selector: 'comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  commentQueryService = inject(CommentQueryService);
  authenticationService = inject(AuthenticationService);

  @Input() commentService!: AbstractCommentService;

  @Input() modelId!: string;
  parentCommentId?: string;

  message?: string;

  isEditForm: boolean = false;
  editComment?: Comment;

  formGroup = new FormGroup({
    content: new FormControl('', [
    ]),
  });

  constructor() {
    this.eventBus.listen(CreateCommentEvent.name, (event: CreateCommentEvent) => {
      this.isEditForm = false;
      this.parentCommentId = undefined;
      this.formGroup.setValue({
        content: ''
      });
    });

    this.eventBus.listen(CreateCommentReplayEvent.name, (event: CreateCommentReplayEvent) => {
      this.isEditForm = false;
      this.parentCommentId = event.parentCommentId;
      this.formGroup.setValue({
        content: ''
      });
    });

    this.eventBus.listen(UpdateCommentEvent.name, (event: UpdateCommentEvent) => {
      this.isEditForm = true;
      this.commentQueryService.get(event.commentId).pipe(take(1)).subscribe({
        next: data => {
          this.editComment = data;
          this.formGroup.setValue({
            content: this.editComment?.content ?? ""
          });
        }
      })
    });
  }
  submit() {
    this.logger.debug(CommentFormComponent.name, "submit");
    if (this.formGroup.valid) {
      this.isEditForm ? this.update() : this.create();
    }
  }

  create() {
    let command = new CreateCommentCommand();
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';

    this.authenticationService.userId$().subscribe({
      next: userId => {
        if (userId == null) {
          this.logger.debug(CommentFormComponent.name, " error occurred while creating command ");
          this.message = "";
          return;
        }
        command.userId = userId;
        if (this.parentCommentId == null) {
          this.commentService.create(this.modelId, command)
            .pipe(first())
            .subscribe({
              next: response => {
                this.logger.debug(CommentFormComponent.name, " comment created ", response.id);
                this.eventBus.emit(CommentCreatedEvent.name, new CommentCreatedEvent(response.id));
              },
              error: e => {
                this.logger.debug(CommentFormComponent.name, " error occurred while creating command ", e);
                this.message = e.message;
              }
            });
        } else {
          this.commentService.createRepley(this.modelId, this.parentCommentId, command)
            .pipe(first())
            .subscribe({
              next: response => {
                this.logger.debug(CommentFormComponent.name, " comment created ", response.id);
                this.eventBus.emit(CommentCreatedEvent.name, new CommentCreatedEvent(response.id));
              },
              error: e => {
                this.logger.debug(CommentFormComponent.name, " error occurred while creating command ", e);
                this.message = e.message;
              }
            });
        }
      }
    });
  }

  update() {
    let command = new UpdateCommentCommand();
    command.commentId = this.editComment?.id ?? '';
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';

    this.commentService.update(this.modelId, command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(CommentFormComponent.name, " command updated ", command.commentId);
          this.eventBus.emit(CommentUpdatedEvent.name, new CommentUpdatedEvent(command.commentId));
        },
        error: e => {
          this.logger.debug(CommentFormComponent.name, " error occurred while updating command ", e);
          this.message = e.message;
        }
      });

  }
}
