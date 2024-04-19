import { Category } from "../category/category.model";
import { Comment } from "../comment/comment.model";
import { Group } from "../group/group.model";
import { Topic } from "../topic/topic.model";
import { Voting } from "../voting/vote.model";

export class Path {
    id!: string;
    name!: string;
    content!: string;
    status!: PathStatus;

    categories!: Category[];
    topics!: PathItem[];
    groups!: PathItem[];

    comments!: Comment[];
    voting!: Voting;

    createdBy!: string;
    createdDate!: Date;
    lastModifiedBy!: string;
    lastModifiedDate!: Date;
}
export class PathItem {
    id!: string;
    number!: number;
    type!: ItemType;
    entityType!: ItemEntityType;
    entityId!: string;
    entity!: any;
}
export enum PathStatus {
    UNVERIFIED = "UNVERIFIED",
    VERIFIED = "VERIFIED",
}
export enum ItemType {
    OPTIONAL = "OPTIONAL",
    MANDATORY = "MANDATORY",
}
export enum ItemEntityType {
    TOPIC = "TOPIC",
    GROUP = "GROUP",
}

export class CreatePathCommand {
    name!: string;
    content!: string;
    categoryIds!: string[];
    items!: CreatePathItemCommand[];
}
export class CreatePathItemCommand {
    number!: number;
    type!: ItemType;
    entityType!: ItemEntityType;
    entityId!: string;
}

export class UpdatePathCommand {
    pathId!: string;
    name!: string;
    content!: string;
    categoryIds!: string[];
    items!: CreatePathItemCommand[];
}
export class UpdatePathItemCommand {
    itemId!: string;
    number!: number;
    type!: ItemType;
    entityType!: ItemEntityType;
    entityId!: string;
}