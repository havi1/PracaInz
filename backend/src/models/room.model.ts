import {  Schema, model } from "mongoose";

export interface Room {
    type:string;
    id: string;
    name: string;
    price:number;
    rooms:number;
    beds:number;
    tag:string[];
    imageUrl:string;
    imageUrls:string[];
    maxGuests:number;
    desc:string;
    desc_long:string;

}

 export const RoomSchema = new Schema<Room>(
    {
        name:{type: String, required: true},
        price:{type: Number, required: true},
        rooms:{type: Number, required: true},
        beds:{type: Number, required: true},
        tag:{type: [String]},
        imageUrls:{type:[String]},
        imageUrl:{type: String, required: true},
        maxGuests:{type: Number, required: true},
        desc:{type: String, required: true}, 
        desc_long:{type: String, required: true}, 
        type: {type: String, required: true}
    }, {
        toJSON:{
            virtuals:true
        }, 
        toObject: {
            virtuals:true
        },
        timestamps:true
    }
 )

 export const RoomModel = model<Room>('room', RoomSchema);
