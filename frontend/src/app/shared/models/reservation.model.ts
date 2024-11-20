import { Cottage } from "./cottage.model";
import { User } from "./user.model";

export class Reservation {
_id!:string;
roomId!:Cottage;
userId!:User;
startDate!:string;
endDate!:string;
totalPrice!:number;
}
