import { Category } from "../category/category.model";
import { Reference } from "../reference/reference.model";

export class Topic {
    id!: string;
    name?: string;
    content? : string;
    status?: TopicStatus;
    categories?: Category[];
    references?: Reference[];
    
    createdBy!: String;
    createdDate!: Date;
    lastModifiedBy!: String;
    lastModifiedDate!: Date;
}

export enum TopicStatus {
    UNVERIFIED,
    VERIFIED
}

export class CreateTopicCommand {
    name!: string;
    content! : string;
    categoryIds!: string[];
}
export class UpdateTopicCommand {
    id!: string;
    name!: string;
    content! : string;
    categoryIds!: string[];
}