import { DomainObjectType } from "../voting/vote.model";
import { ProgressType } from "./progress.model";

export class ProgressSetEvent {
    userId!: string;
    progressType!: ProgressType;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
    constructor(
        userId: string,
        progressType: ProgressType,
        domainObject: string,
        domainObjectType: DomainObjectType,
    ) {
        this.userId = userId;
        this.progressType = progressType;
        this.domainObject = domainObject;
        this.domainObjectType = domainObjectType;
    }
}
