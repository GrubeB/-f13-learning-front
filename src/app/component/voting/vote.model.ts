export class Voting {
    likesNumber!: number;
    dislikesNumber!: number;
}
export class Vote {
    userId!: string;
    type!: VoteType;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
}
export enum VoteType {
    NULL = "NULL",
    LIKE = "LIKE",
    DISLIKE = "DISLIKE",
}
export enum DomainObjectType {
    REFERENCE = "REFERENCE",
    TOPIC = "TOPIC",
    CATEGORY = "CATEGORY",
    COMMENT = "COMMENT",
}