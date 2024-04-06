
export class User {
    id!:string;
    email!: string;
    fullName?: string;
    username?:string;
    avatarFileId?:string;
    
    roles?:string[];
    permissions?:string[];

    createdBy!:string;
    createdDate!:Date;
    lastModifiedBy!:string;
    lastModifiedDate!:Date;
}