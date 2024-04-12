import { Voting } from "../voting/vote.model";

export class ReferenceContainer {
    references!: Reference[];
}
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

export class CreateReferenceCommand {
    author!: string;
    title!: string;
    publicationDate!: Date;
    description!: string;
    link!: string;
}
export class UpdateReferenceCommand {
    id!: string;
    author!: string;
    title!: string;
    publicationDate!: Date;
    description!: string;
    link!: string;
}