export class Category {
    id!: number;
    name?: string;
    description? : string;
    status?: CategoryStatus;
    parents?: Category[];
    children?: Category[];
}

export enum CategoryStatus {
    UNVERIFIED,
    VERIFIED
}