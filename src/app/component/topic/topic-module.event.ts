export class ShowTopicDetailsModalEvent {
    topicId!: string;
    constructor(topicId: string){
        this.topicId = topicId;
    }
}
export class HideTopicDetailsModalEvent {
}