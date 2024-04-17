import { Filter } from "../../shared/filter/filter.model";
import { Path } from "./path.model";

// EVENTS
export class PathCreatedEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
export class PathUpdateddEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
export class PathDeletedEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}

// COMMANDS
export class CreatePathEvent {
}
export class UpdatePathEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
export class DeletePathEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}

// COMPONENTS
export class ShowPathDetailsModalEvent {
    modelId!: string;
    constructor(modelId: string) {
        this.modelId = modelId;
    }
}
export class HidePathDetailsModalEvent {
}

export class PathFilterChangedEvent {
    filter!: Filter<Path>;
    constructor(filter: Filter<Path>) {
        this.filter = filter;
    }
}