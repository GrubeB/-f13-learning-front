export class CategoryCreatedEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}
export class CategoryDeletedEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}
export class DeleteCategoryEvent {
    topicId!: string;
    constructor(topicId: string) {
        this.topicId = topicId;
    }
}