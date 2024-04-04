// EVENTS
export class CategoryCreatedEvent {
    categoryId!: string;
    constructor(categoryId: string) {
        this.categoryId = categoryId;
    }
}
export class CategoryDeletedEvent {
    categoryId!: string;
    constructor(categoryId: string) {
        this.categoryId = categoryId;
    }
}
export class CategoryUpdatedEvent {
    categoryId!: string;
    constructor(categoryId: string) {
        this.categoryId = categoryId;
    }
}
// COMMANDS
export class CreateCategoryEvent {
}
export class DeleteCategoryEvent {
    categoryId!: string;
    constructor(categoryId: string) {
        this.categoryId = categoryId;
    }
}
export class EditCategoryEvent {
    categoryId!: string;
    constructor(categoryId: string) {
        this.categoryId = categoryId;
    }
}

// COMPONENTS