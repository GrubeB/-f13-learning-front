// EVENTS
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
export class ReferenceLikeDislikRemovedEvent {
    referenceId!: string;
    userId!: string;
    constructor(referenceId: string, userId: string) {
        this.referenceId = referenceId;
        this.userId = userId;
    }
}
//COMMANDS 
export class CreateReferenceEvent {
}
export class DeleteReferenceEvent {
    referenceId!: string;
    constructor(referenceId: string) {
        this.referenceId = referenceId;
    }
}
export class EditReferenceEvent {
    referenceId!: string;
    constructor(referenceId: string) {
        this.referenceId = referenceId;
    }
}

// COMPONENTS
export class ShowReferenceItemContextMenuEvent {
    referenceId!: string;
    posX!: number;
    posY!: number;
    constructor(
        referenceId: string,
        posX: number,
        posY: number
    ) {
        this.referenceId = referenceId;
        this.posX = posX;
        this.posY = posY;
    }
}