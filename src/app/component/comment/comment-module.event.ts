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
export class CommentLikedEvent {
    commentId!: string;
    userId!: string;
    constructor(commentId: string, userId: string) {
        this.commentId = commentId;
        this.userId = userId;
    }
}
export class CommentDislikedEvent {
    commentId!: string;
    userId!: string;
    constructor(commentId: string, userId: string) {
        this.commentId = commentId;
        this.userId = userId;
    }
}
export class CommentLikeDislikRemovedEvent {
    commentId!: string;
    userId!: string;
    constructor(commentId: string, userId: string) {
        this.commentId = commentId;
        this.userId = userId;
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