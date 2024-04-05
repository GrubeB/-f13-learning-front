export class ReferenceLikedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}
export class ReferenceDislikedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}
export class ReferenceLikeDislikRemovedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}
// COMMENTS
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