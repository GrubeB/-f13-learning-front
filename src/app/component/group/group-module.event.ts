// EVENTS
export class GroupCreatedEvent {
    groupId!: string;
    constructor(groupId: string) {
        this.groupId = groupId;
    }
}
export class GroupUpdateddEvent {
    groupId!: string;
    constructor(groupId: string) {
        this.groupId = groupId;
    }
}
export class GroupDeletedEvent {
    groupId!: string;
    constructor(groupId: string) {
        this.groupId = groupId;
    }
}

// COMMANDS
export class CreateGroupEvent {
}
export class UpdateGroupEvent {
    groupId!: string;
    constructor(groupId: string) {
        this.groupId = groupId;
    }
}
export class DeleteGroupEvent {
    groupId!: string;
    constructor(groupId: string) {
        this.groupId = groupId;
    }
}