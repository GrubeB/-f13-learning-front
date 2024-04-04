// EVENTS
export class TopicCreatedEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}
export class TopicUpdateddEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}
export class TopicDeletedEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}

// COMMANDS
export class CreateTopicEvent{
}
export class UpdateTopicEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}
export class DeleteTopicEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}

// COMPONENTS
export class ShowTopicDetailsModalEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}
export class HideTopicDetailsModalEvent {
}

export class TopicDetailsFilterChangedEvent {
    sorterIndex!: number;
    filterIndex!: number;
    constructor(sorterIndex: number, filterIndex: number) {
        this.sorterIndex = sorterIndex;
        this.filterIndex = filterIndex;
    }
}