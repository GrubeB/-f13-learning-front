import { DomainObjectType } from "../voting/vote.model";

export class Progress {
    id!: string;
    userId!: string;
    type!: ProgressType;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
}
export enum ProgressType {
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    PLAN_TO_LEARN = "PLAN_TO_LEARN",
    DROPPED = "DROPPED",
    DONE = "DONE",
}