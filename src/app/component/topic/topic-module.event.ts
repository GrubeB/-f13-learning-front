export class ShowTopicDetailsModalEvent {
    topicId!: string;
    constructor(topicId: string){
        this.topicId = topicId;
    }
}
export class HideTopicDetailsModalEvent {
}

export class TopicDetailsFilterChangedEvent {
    sorterIndex!: number;
    filterIndex!: number;
    constructor(sorterIndex: number, filterIndex:number){
        this.sorterIndex = sorterIndex;
        this.filterIndex = filterIndex;
    }
}