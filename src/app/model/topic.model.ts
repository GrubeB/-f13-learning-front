import { Category } from "./category.model";
import { Reference } from "./reference.model";

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