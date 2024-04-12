// EVENTS
export class GroupCreatedEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
export class GroupUpdateddEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
export class GroupDeletedEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}

// COMMANDS
export class CreateGroupEvent {
}
export class UpdateGroupEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
export class DeleteGroupEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
// COMPONENTS
export class ShowGroupDetailsModalEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}