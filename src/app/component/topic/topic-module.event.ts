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
export class ShowTopicItemContextMenuEvent {
    topicId!: string;
    posX!: number;
    posY!: number;
    constructor(
        topicId: string,
        posX: number,
        posY: number
    ) {
        this.topicId = topicId;
        this.posX = posX;
        this.posY = posY;
    }
}