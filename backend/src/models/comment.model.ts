import { Schema, model } from "mongoose";

export interface Comment {
    id:string;
    roomId:string;
    userId:string;
    createDate:Date;
    text:string;
    rating:number;
}


const commentSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, ref: 'room', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true }, 
    createDate: { type: Date, required: true },
    text: { type: String, required: true },
    rating:{type:Number, required:true}
  });

export const CommentModel = model<Comment>('commentModel', commentSchema);