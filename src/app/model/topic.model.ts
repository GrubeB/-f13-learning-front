import { Category } from "./category.model";

export class Topic {
    id!: string;
    name?: string;
    content? : string;
    status?: TopicStatus;
    categories?: Category[];
    references?: Reference[];
    
    createdBy?: String;
    createdDate?: Date;
    lastModifiedBy?: String;
    lastModifiedDate?: Date;
}

export enum TopicStatus {
    UNVERIFIED,
    VERIFIED
}

export class Reference {
    id!: string;
    title?: string;
    author? : string;
    publicationDate? : Date;
    description? : string;
    link? : string;
    status?: ReferenceStatus;
    likesNumber!: number;
    dislikesNumber!: number;
}
export enum ReferenceStatus {
    UNVERIFIED,
    VERIFIED
}