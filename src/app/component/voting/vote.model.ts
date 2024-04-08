export class Voting {
    likesNumber!: number;
    dislikesNumber!: number;
}
export class Vote {
    userId!: string;
    type!: VoteType;
    domainObject!: string;
    domainObjectType!: string;
}
export enum VoteType {
    LIKE,
    DISLIKE,
}
export enum DomainObjectType {
    REFERENCE,
    TOPIC,
    CATEGORY,
    COMMENT,
}