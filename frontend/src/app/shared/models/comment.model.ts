import { User } from "./user.model";

export class Comment {
    id!:string;
    userId!: User;
    roomId!:string;
    text!:string;
    createDate!:string;
    rating!:number;
}