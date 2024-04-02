export class ReferenceCreatedEvent {
    referenceId!: string;
    constructor(referenceId: string) {
        this.referenceId = referenceId;
    }
}
export class ReferenceLikedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}
export class ReferenceDislikedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}
export class ReferenceLikeRemovedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}
export class ReferenceDislikeRemovedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}