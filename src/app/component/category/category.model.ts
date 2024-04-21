export class Category {
    id!: string;
    name!: string;
    description! : string;
    status!: CategoryStatus;
    parents!: Category[];
    children!: Category[];
}

export enum CategoryStatus {
    UNVERIFIED,
    VERIFIED
}

export class CreateCategoryCommand {
    name!: string;
    description! : string;
    parents!: string[];
    children!: string[];
}
export class UpdateCategoryCommand {
    id!: string;
    name!: string;
    description! : string;
    parents!: string[];
    children!: string[];
}