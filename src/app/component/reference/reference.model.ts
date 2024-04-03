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

    createdBy!: String;
    createdDate!: Date;
    lastModifiedBy!: String;
    lastModifiedDate!: Date;
}

export enum ReferenceStatus {
    UNVERIFIED,
    VERIFIED
}