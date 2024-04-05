// EVENTS
export class CommentCreatedEvent {
    commentId!: string;
    constructor(commentId: string) {
        this.commentId = commentId;
    }
}
export class CommentUpdatedEvent {
    commentId!: string;
    constructor(commentId: string) {
        this.commentId = commentId;
    }
}
export class CommentDeletedEvent {
    commentId!: string;
    constructor(commentId: string) {
        this.commentId = commentId;
    }
}
//COMMANDS 
export class CreateCommentEvent {
}
export class CreateCommentReplayEvent {
    parentCommentId!: string;
    constructor(parentCommentId: string) {
        this.parentCommentId = parentCommentId;
    }
}
export class DeleteCommentEvent {
    commentId!: string;
    constructor(commentId: string) {
        this.commentId = commentId;
    }
}
export class UpdateCommentEvent {
    commentId!: string;
    constructor(commentId: string) {
        this.commentId = commentId;
    }
}