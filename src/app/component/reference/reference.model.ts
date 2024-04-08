import { Voting } from "../voting/vote.model";

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
export enum ReferenceStatus {
    UNVERIFIED,
    VERIFIED
}