import { DomainObjectType } from "./vote.model";

export class LikedEvent {
    userId!: string;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
    constructor(
        userId: string,
        domainObject: string,
        domainObjectType: DomainObjectType,
    ) {
        this.userId = userId;
        this.domainObject = domainObject;
        this.domainObjectType = domainObjectType;
    }
}
export class LikeRemvedEvent {
    userId!: string;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
    constructor(
        userId: string,
        domainObject: string,
        domainObjectType: DomainObjectType,
    ) {
        this.userId = userId;
        this.domainObject = domainObject;
        this.domainObjectType = domainObjectType;
    }
}
export class DislikedEvent {
    userId!: string;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
    constructor(
        userId: string,
        domainObject: string,
        domainObjectType: DomainObjectType,
    ) {
        this.userId = userId;
        this.domainObject = domainObject;
        this.domainObjectType = domainObjectType;
    }
}
export class DisLikeRemvedEvent {
    userId!: string;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
    constructor(
        userId: string,
        domainObject: string,
        domainObjectType: DomainObjectType,
    ) {
        this.userId = userId;
        this.domainObject = domainObject;
        this.domainObjectType = domainObjectType;
    }
}
export class LikeDislikRemovedEvent {
    userId!: string;
    domainObject!: string;
    domainObjectType!: DomainObjectType;
    constructor(
        userId: string,
        domainObject: string,
        domainObjectType: DomainObjectType,
    ) {
        this.userId = userId;
        this.domainObject = domainObject;
        this.domainObjectType = domainObjectType;
    }
}