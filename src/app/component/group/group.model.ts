import { Category } from "../category/category.model";
import { Comment } from "../comment/comment.model";
import { Reference } from "../reference/reference.model";
import { Topic } from "../topic/topic.model";
import { Voting } from "../voting/vote.model";

export class Group {
    id!: string;
    name!: string;
    content! : string;
    status!: GroupStatus;
    categories!: Category[];
    references!: Reference[];
    
    topics!: Topic[];
    groups!: Group[];
    comments!: Comment[];
    voting!: Voting;
    
    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}

export enum GroupStatus {
    UNVERIFIED,
    VERIFIED
}

export class CreateGroupCommand {
    name!: string;
    content! : string;
    categoryIds!: string[];
    topicIds!: string[];
    groupIds!: string[];
}

export class UpdateGroupCommand {
    id!: string;
    name!: string;
    content! : string;
    categoryIds!: string[];
    topicIds!: string[];
    groupIds!: string[];
}