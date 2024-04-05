import { Voting } from "../reference/reference.model";

export class CommentContainer {
    comments!:Comment[];
}
export class Comment {
    id!:string;
    content!: string;
    userId!: string;
    comments!:Comment[];
    voting!:Voting;
    createdBy!:string;
    createdDate!:Date;
    lastModifiedBy!:string;
    lastModifiedDate!:Date;
}


export class CreateCommentCommand {
    userId!: string;
    content!: string;
}
export class UpdateCommentCommand {
    commentId!:string;
    content!: string;
}