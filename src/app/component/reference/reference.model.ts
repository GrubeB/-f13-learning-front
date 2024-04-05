export class Reference {
    id!: string;
    title!: string;
    author! : string;
    publicationDate! : Date;
    description! : string;
    link! : string;
    status!: ReferenceStatus;
    voting!: Voting;

    createdBy!: String;
    createdDate!: Date;
    lastModifiedBy!: String;
    lastModifiedDate!: Date;
}

export class Voting{
    likesNumber!: number;
    dislikesNumber!: number;
}
export enum ReferenceStatus {
    UNVERIFIED,
    VERIFIED
}