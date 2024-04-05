// EVENTS
export class ReferenceCreatedEvent {
    referenceId!: string;
    constructor(referenceId: string) {
        this.referenceId = referenceId;
    }
}
export class ReferenceUpdatedEvent {
    referenceId!: string;
    constructor(referenceId: string) {
        this.referenceId = referenceId;
    }
}
export class ReferenceDeletedEvent {
    referenceId!: string;
    constructor(referenceId: string) {
        this.referenceId = referenceId;
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
export class UpdateReferenceEvent {
    referenceId!: string;
    constructor(referenceId: string) {
        this.referenceId = referenceId;
    }
}

// COMPONENTS